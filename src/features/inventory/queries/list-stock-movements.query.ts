import "server-only"

import { prisma } from "@/lib/prisma"

const MOVEMENT_TYPES = ["ADJUSTMENT", "TRANSFER", "PURCHASE_RECEIPT", "SALES_ISSUE"] as const
const MOVEMENT_STATUSES = ["POSTED", "VOIDED"] as const

type PaginationParams = {
  page?: number
  pageSize?: number
  search?: string
  type?: string
  status?: string
  productId?: string
  warehouseId?: string
  from?: string
  to?: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ListStockMovementsResult = {
  rows: Array<{
    id: number
    type: string
    status: string
    reference: string | null
    occurredAt: Date
    createdAt: Date
    lines: Array<{
      id: number
      quantityDelta: number
      product: { id: number; sku: string; name: string }
      warehouse: { id: number; code: string; name: string }
    }>
  }>
  pagination: PaginationMeta
}

export async function listStockMovements(
  params: PaginationParams = {}
): Promise<ListStockMovementsResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)))

  const search = params.search?.trim() || undefined

  const searchFilter = search
    ? {
        OR: [
          { reference: { contains: search, mode: "insensitive" as const } },
          {
            lines: {
              some: {
                OR: [
                  { product: { sku: { contains: search, mode: "insensitive" as const } } },
                  { product: { name: { contains: search, mode: "insensitive" as const } } },
                  { warehouse: { code: { contains: search, mode: "insensitive" as const } } },
                  { warehouse: { name: { contains: search, mode: "insensitive" as const } } },
                ],
              },
            },
          },
        ],
      }
    : undefined

  const typeFilter = MOVEMENT_TYPES.includes(params.type as typeof MOVEMENT_TYPES[number])
    ? { type: params.type as typeof MOVEMENT_TYPES[number] }
    : undefined

  const statusFilter = MOVEMENT_STATUSES.includes(params.status as typeof MOVEMENT_STATUSES[number])
    ? { status: params.status as typeof MOVEMENT_STATUSES[number] }
    : undefined

  const productIdValue = params.productId ? Number(params.productId) : NaN
  const productFilter = !Number.isNaN(productIdValue) && productIdValue > 0
    ? { lines: { some: { productId: productIdValue } } }
    : undefined

  const warehouseIdValue = params.warehouseId ? Number(params.warehouseId) : NaN
  const warehouseFilter = !Number.isNaN(warehouseIdValue) && warehouseIdValue > 0
    ? { lines: { some: { warehouseId: warehouseIdValue } } }
    : undefined

  const fromDate = params.from ? new Date(params.from) : undefined
  const validFrom = fromDate && !Number.isNaN(fromDate.getTime()) ? fromDate : undefined

  const toDate = params.to ? new Date(params.to) : undefined
  const validTo = toDate && !Number.isNaN(toDate.getTime()) ? toDate : undefined

  const dateFilter = validFrom || validTo
    ? {
        occurredAt: {
          ...(validFrom ? { gte: validFrom } : {}),
          ...(validTo ? { lte: validTo } : {}),
        },
      }
    : undefined

  const filters = [searchFilter, typeFilter, statusFilter, productFilter, warehouseFilter, dateFilter].filter(
    (f): f is NonNullable<typeof f> => f != null
  )
  const where = filters.length === 0
    ? undefined
    : filters.length === 1
      ? filters[0]
      : { AND: filters }

  const [dbRows, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      select: {
        id: true,
        type: true,
        status: true,
        reference: true,
        occurredAt: true,
        createdAt: true,
        lines: {
          select: {
            id: true,
            quantityDelta: true,
            product: {
              select: { id: true, sku: true, name: true },
            },
            warehouse: {
              select: { id: true, code: true, name: true },
            },
          },
        },
      },
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.stockMovement.count({ where }),
  ])

  const rows = dbRows.map((r) => ({
    ...r,
    lines: r.lines.map((l) => ({
      ...l,
      quantityDelta: Number(l.quantityDelta),
    })),
  }))

  return {
    rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

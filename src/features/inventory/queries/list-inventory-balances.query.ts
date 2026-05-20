import "server-only"

import { prisma } from "@/lib/prisma"

type PaginationParams = {
  page?: number
  pageSize?: number
  search?: string
  productId?: string
  warehouseId?: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ListInventoryBalancesResult = {
  rows: Array<{
    id: number
    quantityOnHand: number
    updatedAt: Date
    product: { id: number; sku: string; name: string }
    warehouse: { id: number; code: string; name: string }
  }>
  pagination: PaginationMeta
}

export async function listInventoryBalances(
  params: PaginationParams = {}
): Promise<ListInventoryBalancesResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)))

  const search = params.search?.trim() || undefined

  const searchFilter = search
    ? {
        OR: [
          { product: { sku: { contains: search, mode: "insensitive" as const } } },
          { product: { name: { contains: search, mode: "insensitive" as const } } },
          { warehouse: { code: { contains: search, mode: "insensitive" as const } } },
          { warehouse: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : undefined

  const productIdValue = params.productId ? Number(params.productId) : NaN
  const productFilter = !Number.isNaN(productIdValue) && productIdValue > 0
    ? { productId: productIdValue }
    : undefined

  const warehouseIdValue = params.warehouseId ? Number(params.warehouseId) : NaN
  const warehouseFilter = !Number.isNaN(warehouseIdValue) && warehouseIdValue > 0
    ? { warehouseId: warehouseIdValue }
    : undefined

  const filters = [searchFilter, productFilter, warehouseFilter].filter(
    (f): f is NonNullable<typeof f> => f != null
  )
  const where = filters.length === 0
    ? undefined
    : filters.length === 1
      ? filters[0]
      : { AND: filters }

  const [dbRows, total] = await Promise.all([
    prisma.inventoryBalance.findMany({
      where,
      select: {
        id: true,
        quantityOnHand: true,
        updatedAt: true,
        product: {
          select: { id: true, sku: true, name: true },
        },
        warehouse: {
          select: { id: true, code: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.inventoryBalance.count({ where }),
  ])

  const rows = dbRows.map((r) => ({
    ...r,
    quantityOnHand: Number(r.quantityOnHand),
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

import "server-only"

import { prisma } from "@/lib/prisma"

type PaginationParams = {
  page?: number
  pageSize?: number
  search?: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type LowStockBalanceRow = {
  id: number
  quantityOnHand: number
  updatedAt: Date
  product: { id: number; sku: string; name: string; lowStockThreshold: number }
  warehouse: { id: number; code: string; name: string }
}

export type ListLowStockBalancesResult = {
  rows: LowStockBalanceRow[]
  pagination: PaginationMeta
}

export async function listLowStockBalances(
  params: PaginationParams = {}
): Promise<ListLowStockBalancesResult> {
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

  const dbRows = await prisma.inventoryBalance.findMany({
    where: {
      AND: [
        { product: { lowStockThreshold: { not: null } } },
        ...(searchFilter ? [searchFilter] : []),
      ],
    },
    select: {
      id: true,
      quantityOnHand: true,
      updatedAt: true,
      product: {
        select: { id: true, sku: true, name: true, lowStockThreshold: true },
      },
      warehouse: {
        select: { id: true, code: true, name: true },
      },
    },
  })

  const mapped = dbRows
    .map((r) => ({
      id: r.id,
      quantityOnHand: Number(r.quantityOnHand),
      updatedAt: r.updatedAt,
      product: {
        id: r.product.id,
        sku: r.product.sku,
        name: r.product.name,
        lowStockThreshold: Number(r.product.lowStockThreshold!),
      },
      warehouse: {
        id: r.warehouse.id,
        code: r.warehouse.code,
        name: r.warehouse.name,
      },
    }))
    .filter((r) => r.quantityOnHand <= r.product.lowStockThreshold)
    .sort((a, b) => {
      if (a.quantityOnHand !== b.quantityOnHand) {
        return a.quantityOnHand - b.quantityOnHand
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

  const total = mapped.length
  const rows = mapped.slice((page - 1) * pageSize, page * pageSize)

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

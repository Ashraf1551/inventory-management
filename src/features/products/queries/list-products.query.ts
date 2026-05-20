import "server-only"

import { prisma } from "@/lib/prisma"

type PaginationParams = {
  page?: number
  pageSize?: number
  search?: string
  status?: "all" | "active" | "inactive"
  categoryId?: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ListProductsResult = {
  rows: Array<{
    id: number
    sku: string
    name: string
    description: string | null
    lowStockThreshold: number | null
    category: { id: number; name: string } | null
    isActive: boolean
    createdAt: Date
  }>
  pagination: PaginationMeta
}

export async function listProducts(
  params: PaginationParams = {}
): Promise<ListProductsResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)))
  const search = params.search?.trim() || undefined
  const status = ["active", "inactive"].includes(params.status ?? "")
    ? (params.status as "active" | "inactive")
    : undefined

  const isActiveFilter = status ? { isActive: status === "active" } : undefined

  const searchFilter = search
    ? {
        OR: [
          { sku: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined

  let categoryFilter: { categoryId: number } | { categoryId: null } | undefined

  if (params.categoryId === "uncategorized") {
    categoryFilter = { categoryId: null }
  } else if (params.categoryId && /^\d+$/.test(params.categoryId)) {
    categoryFilter = { categoryId: Number(params.categoryId) }
  }

  const filters = [isActiveFilter, searchFilter, categoryFilter].filter(Boolean)
  const where = filters.length > 0
    ? Object.assign({}, ...filters)
    : undefined

  const [dbRows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        lowStockThreshold: true,
        category: {
          select: { id: true, name: true },
        },
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  const rows = dbRows.map((r) => ({
    ...r,
    lowStockThreshold: r.lowStockThreshold ? Number(r.lowStockThreshold) : null,
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

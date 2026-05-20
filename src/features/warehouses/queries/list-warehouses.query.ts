import "server-only"

import { prisma } from "@/lib/prisma"

type PaginationParams = {
  page?: number
  pageSize?: number
  search?: string
  status?: "all" | "active" | "inactive"
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ListWarehousesResult = {
  rows: Array<{
    id: number
    code: string
    name: string
    address: string | null
    isActive: boolean
    createdAt: Date
  }>
  pagination: PaginationMeta
}

export async function listWarehouses(
  params: PaginationParams = {}
): Promise<ListWarehousesResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)))

  const search = params.search?.trim() || undefined
  const status = ["active", "inactive"].includes(params.status ?? "")
    ? (params.status as "active" | "inactive")
    : undefined

  const searchFilter = search
    ? {
        OR: [
          { code: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined

  const isActiveFilter = status ? { isActive: status === "active" } : undefined

  const filters = [isActiveFilter, searchFilter].filter(Boolean)
  const where = filters.length > 0 ? Object.assign({}, ...filters) : undefined

  const [rows, total] = await Promise.all([
    prisma.warehouse.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        address: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.warehouse.count({ where }),
  ])

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

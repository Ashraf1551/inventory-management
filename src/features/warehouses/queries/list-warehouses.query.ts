import "server-only"

import { prisma } from "@/lib/prisma"

type PaginationParams = {
  page?: number
  pageSize?: number
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

  const [rows, total] = await Promise.all([
    prisma.warehouse.findMany({
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
    prisma.warehouse.count(),
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

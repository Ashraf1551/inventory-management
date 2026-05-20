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

export type ListProductCategoriesResult = {
  rows: Array<{
    id: number
    name: string
    description: string | null
    isActive: boolean
    createdAt: Date
  }>
  pagination: PaginationMeta
}

export async function listProductCategories(
  params: PaginationParams = {}
): Promise<ListProductCategoriesResult> {
  const page = Math.max(1, Math.floor(params.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)))

  const search = params.search?.trim() || undefined

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : undefined

  const [rows, total] = await Promise.all([
    prisma.productCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.productCategory.count({ where }),
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

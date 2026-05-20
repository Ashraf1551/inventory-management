import "server-only"

import { prisma } from "@/lib/prisma"

export type ProductCategoryDetail = {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getProductCategory(
  id: number
): Promise<ProductCategoryDetail | null> {
  return prisma.productCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

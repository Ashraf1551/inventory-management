import "server-only"

import { prisma } from "@/lib/prisma"

export type GetProductResult = {
  id: number
  sku: string
  name: string
  description: string | null
  category: { id: number; name: string } | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
} | null

export async function getProduct(id: number): Promise<GetProductResult> {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      sku: true,
      name: true,
      description: true,
      category: {
        select: { id: true, name: true },
      },
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

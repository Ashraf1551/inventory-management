import "server-only"

import { prisma } from "@/lib/prisma"

export type GetProductResult = {
  id: number
  sku: string
  name: string
  description: string | null
  lowStockThreshold: number | null
  category: { id: number; name: string } | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
} | null

export async function getProduct(id: number): Promise<GetProductResult> {
  const product = await prisma.product.findUnique({
    where: { id },
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
      updatedAt: true,
    },
  })

  if (!product) return null

  return {
    ...product,
    lowStockThreshold: product.lowStockThreshold ? Number(product.lowStockThreshold) : null,
  }
}

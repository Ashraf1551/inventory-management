import "server-only"

import { prisma } from "@/lib/prisma"

export type ActiveProductOption = {
  id: number
  sku: string
  name: string
}

export async function listActiveProducts(): Promise<ActiveProductOption[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, sku: true, name: true },
    orderBy: { name: "asc" },
  })
}

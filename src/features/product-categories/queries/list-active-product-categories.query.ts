import "server-only"

import { prisma } from "@/lib/prisma"

export type ActiveProductCategoryOption = {
  id: number
  name: string
}

export async function listActiveProductCategories(): Promise<ActiveProductCategoryOption[]> {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

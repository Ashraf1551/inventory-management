import "server-only"

import { prisma } from "@/lib/prisma"

export type ActiveWarehouseOption = {
  id: number
  code: string
  name: string
}

export async function listActiveWarehouses(): Promise<ActiveWarehouseOption[]> {
  return prisma.warehouse.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { name: "asc" },
  })
}

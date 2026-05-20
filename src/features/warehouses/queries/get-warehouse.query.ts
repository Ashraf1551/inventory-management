import "server-only"

import { prisma } from "@/lib/prisma"

export type WarehouseDetail = {
  id: number
  code: string
  name: string
  address: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getWarehouse(
  id: number
): Promise<WarehouseDetail | null> {
  return prisma.warehouse.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      address: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

import "server-only"

import { prisma } from "@/lib/prisma"

export type GetSupplierResult = {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
} | null

export async function getSupplier(id: number): Promise<GetSupplierResult> {
  return prisma.supplier.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

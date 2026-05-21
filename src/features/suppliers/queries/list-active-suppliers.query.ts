import "server-only"
import { prisma } from "@/lib/prisma"

export type ListActiveSuppliersResult = Array<{
  id: number
  name: string
  email: string | null
}>

export async function listActiveSuppliers(): Promise<ListActiveSuppliersResult> {
  return prisma.supplier.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })
}

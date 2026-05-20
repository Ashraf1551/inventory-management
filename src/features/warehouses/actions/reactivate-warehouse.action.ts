"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export type ReactivateWarehouseResult =
  | { success: true }
  | { success: false; error: string }

export async function reactivateWarehouse(
  id: number
): Promise<ReactivateWarehouseResult> {
  if (!Number.isInteger(id) || id < 1) {
    return { success: false, error: "Invalid warehouse ID." }
  }

  try {
    const existing = await prisma.warehouse.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!existing) {
      return { success: false, error: "Warehouse not found." }
    }

    if (existing.isActive) {
      return { success: true }
    }

    await prisma.warehouse.update({
      where: { id },
      data: { isActive: true },
    })

    revalidatePath("/warehouses")
    revalidatePath(`/warehouses/${id}`)

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Warehouse not found." }
    }
    throw error
  }
}

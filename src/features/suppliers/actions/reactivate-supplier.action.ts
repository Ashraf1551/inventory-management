"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export type ReactivateSupplierResult =
  | { success: true }
  | { success: false; error: string }

export async function reactivateSupplier(
  id: number
): Promise<ReactivateSupplierResult> {
  if (!Number.isInteger(id) || id < 1) {
    return { success: false, error: "Invalid supplier ID." }
  }

  try {
    const existing = await prisma.supplier.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!existing) {
      return { success: false, error: "Supplier not found." }
    }

    if (existing.isActive) {
      return { success: true }
    }

    await prisma.supplier.update({
      where: { id },
      data: { isActive: true },
    })

    revalidatePath("/suppliers")
    revalidatePath(`/suppliers/${id}`)

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Supplier not found." }
    }
    throw error
  }
}

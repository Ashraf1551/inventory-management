"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export type DeactivateProductResult =
  | { success: true }
  | { success: false; error: string }

export async function deactivateProduct(
  id: number
): Promise<DeactivateProductResult> {
  if (!Number.isInteger(id) || id < 1) {
    return { success: false, error: "Invalid product ID." }
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!existing) {
      return { success: false, error: "Product not found." }
    }

    if (!existing.isActive) {
      return { success: true }
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/products")
    revalidatePath(`/products/${id}`)

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Product not found." }
    }
    throw error
  }
}

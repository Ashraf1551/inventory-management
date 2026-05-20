"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export type DeactivateProductCategoryResult =
  | { success: true }
  | { success: false; error: string }

export async function deactivateProductCategory(
  id: number
): Promise<DeactivateProductCategoryResult> {
  if (!Number.isInteger(id) || id < 1) {
    return { success: false, error: "Invalid category ID." }
  }

  try {
    const existing = await prisma.productCategory.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!existing) {
      return { success: false, error: "Category not found." }
    }

    if (!existing.isActive) {
      return { success: true }
    }

    await prisma.productCategory.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/product-categories")
    revalidatePath(`/product-categories/${id}`)

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Category not found." }
    }
    throw error
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { updateProductCategorySchema } from "@/features/product-categories/schemas/product-category.schema"

export type UpdateProductCategoryResult =
  | { success: true; data: { id: number; name: string } }
  | { success: false; error: string }

export async function updateProductCategory(
  prevState: UpdateProductCategoryResult | null,
  formData: FormData
): Promise<UpdateProductCategoryResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "isActive") {
      raw[key] = value === "on"
    } else if (key === "id") {
      raw[key] = Number(value)
    } else {
      raw[key] = value
    }
  }

  const parsed = updateProductCategorySchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  const { id, ...data } = parsed.data

  try {
    const category = await prisma.productCategory.update({
      where: { id },
      data,
      select: { id: true, name: true },
    })

    revalidatePath("/product-categories")
    revalidatePath(`/product-categories/${id}`)

    return { success: true, data: category }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A category with this name already exists.",
      }
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Category not found.",
      }
    }
    throw error
  }
}

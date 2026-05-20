"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/features/products/schemas/product.schema"

export type UpdateProductResult =
  | { success: true; data: { id: number; sku: string; name: string } }
  | { success: false; error: string }

export async function updateProduct(
  prevState: UpdateProductResult | null,
  formData: FormData
): Promise<UpdateProductResult> {
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

  const parsed = updateProductSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  const { id, ...data } = parsed.data

  if (data.categoryId != null) {
    const category = await prisma.productCategory.findUnique({
      where: { id: data.categoryId },
      select: { isActive: true },
    })

    if (!category) {
      return { success: false, error: "Selected category not found." }
    }

    if (!category.isActive) {
      return { success: false, error: "Selected category is inactive." }
    }
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      select: { id: true, sku: true, name: true },
    })

    revalidatePath("/products")
    revalidatePath(`/products/${id}`)

    return { success: true, data: product }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A product with this SKU already exists.",
      }
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Product not found.",
      }
    }
    throw error
  }
}

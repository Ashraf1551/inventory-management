"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/features/products/schemas/product.schema"

export type CreateProductResult =
  | { success: true; data: { id: number; sku: string; name: string } }
  | { success: false; error: string }

export async function createProduct(
  prevState: CreateProductResult | null,
  formData: FormData
): Promise<CreateProductResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "isActive") {
      raw[key] = value === "on"
    } else {
      raw[key] = value
    }
  }

  const parsed = createProductSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  if (parsed.data.categoryId != null) {
    const category = await prisma.productCategory.findUnique({
      where: { id: parsed.data.categoryId },
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
    const product = await prisma.product.create({
      data: parsed.data,
      select: { id: true, sku: true, name: true },
    })

    revalidatePath("/products")

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
    throw error
  }
}

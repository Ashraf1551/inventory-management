"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createProductCategorySchema } from "@/features/product-categories/schemas/product-category.schema"

export type CreateProductCategoryResult =
  | { success: true; data: { id: number; name: string } }
  | { success: false; error: string }

export async function createProductCategory(
  prevState: CreateProductCategoryResult | null,
  formData: FormData
): Promise<CreateProductCategoryResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "isActive") {
      raw[key] = value === "on"
    } else {
      raw[key] = value
    }
  }

  const parsed = createProductCategorySchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  try {
    const category = await prisma.productCategory.create({
      data: parsed.data,
      select: { id: true, name: true },
    })

    revalidatePath("/product-categories")

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
    throw error
  }
}

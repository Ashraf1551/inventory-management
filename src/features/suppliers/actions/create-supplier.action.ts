"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createSupplierSchema } from "@/features/suppliers/schemas/supplier.schema"

export type CreateSupplierResult =
  | { success: true; data: { id: number; name: string } }
  | { success: false; error: string }

export async function createSupplier(
  prevState: CreateSupplierResult | null,
  formData: FormData
): Promise<CreateSupplierResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "isActive") {
      raw[key] = value === "on"
    } else {
      raw[key] = value
    }
  }

  const parsed = createSupplierSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  try {
    const supplier = await prisma.supplier.create({
      data: parsed.data,
      select: { id: true, name: true },
    })

    // TODO: revalidate suppliers list path when created
    revalidatePath("/suppliers")

    return { success: true, data: supplier }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A supplier with this email already exists.",
      }
    }
    throw error
  }
}

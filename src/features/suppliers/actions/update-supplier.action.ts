"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { updateSupplierSchema } from "@/features/suppliers/schemas/supplier.schema"

export type UpdateSupplierResult =
  | { success: true; data: { id: number; name: string } }
  | { success: false; error: string }

export async function updateSupplier(
  prevState: UpdateSupplierResult | null,
  formData: FormData
): Promise<UpdateSupplierResult> {
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

  const parsed = updateSupplierSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  const { id, ...data } = parsed.data

  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data,
      select: { id: true, name: true },
    })

    revalidatePath("/suppliers")
    revalidatePath(`/suppliers/${id}`)

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Supplier not found.",
      }
    }
    throw error
  }
}

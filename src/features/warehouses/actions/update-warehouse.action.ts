"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { updateWarehouseSchema } from "@/features/warehouses/schemas/warehouse.schema"

export type UpdateWarehouseResult =
  | { success: true; data: { id: number; code: string; name: string } }
  | { success: false; error: string }

export async function updateWarehouse(
  prevState: UpdateWarehouseResult | null,
  formData: FormData
): Promise<UpdateWarehouseResult> {
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

  const parsed = updateWarehouseSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  const { id, ...data } = parsed.data

  try {
    const warehouse = await prisma.warehouse.update({
      where: { id },
      data,
      select: { id: true, code: true, name: true },
    })

    revalidatePath("/warehouses")
    revalidatePath(`/warehouses/${id}`)

    return { success: true, data: warehouse }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A warehouse with this code already exists.",
      }
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Warehouse not found.",
      }
    }
    throw error
  }
}

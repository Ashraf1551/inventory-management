"use server"

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createWarehouseSchema } from "@/features/warehouses/schemas/warehouse.schema"

export type CreateWarehouseResult =
  | { success: true; data: { id: number; code: string; name: string } }
  | { success: false; error: string }

export async function createWarehouse(
  prevState: CreateWarehouseResult | null,
  formData: FormData
): Promise<CreateWarehouseResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "isActive") {
      raw[key] = value === "on"
    } else {
      raw[key] = value
    }
  }

  const parsed = createWarehouseSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  try {
    const warehouse = await prisma.warehouse.create({
      data: parsed.data,
      select: { id: true, code: true, name: true },
    })

    // TODO: revalidatePath("/warehouses") once the warehouses list page exists

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
    throw error
  }
}

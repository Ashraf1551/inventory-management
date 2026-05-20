"use server"

import { stockAdjustmentSchema } from "@/features/inventory/schemas/stock-adjustment.schema"
import { postStockAdjustment, type PostStockAdjustmentResult } from "@/features/inventory/services/post-stock-adjustment.service"

export type CreateStockAdjustmentResult =
  | { success: true; data: { movementId: number } }
  | { success: false; error: string }

export async function createStockAdjustment(
  prevState: CreateStockAdjustmentResult | null,
  formData: FormData
): Promise<CreateStockAdjustmentResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "productId" || key === "warehouseId") {
      raw[key] = Number(value)
    } else {
      raw[key] = value
    }
  }

  const parsed = stockAdjustmentSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  // TODO: revalidatePath("/inventory") once the inventory pages exist

  return postStockAdjustment(parsed.data)
}

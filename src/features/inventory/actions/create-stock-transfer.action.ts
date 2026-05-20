"use server"

import { revalidatePath } from "next/cache"
import { stockTransferSchema } from "@/features/inventory/schemas/stock-transfer.schema"
import { postStockTransfer, type PostStockTransferResult } from "@/features/inventory/services/post-stock-transfer.service"

export type CreateStockTransferResult =
  | { success: true; data: { movementId: number } }
  | { success: false; error: string }

export async function createStockTransfer(
  prevState: CreateStockTransferResult | null,
  formData: FormData
): Promise<CreateStockTransferResult> {
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "productId" || key === "fromWarehouseId" || key === "toWarehouseId") {
      raw[key] = Number(value)
    } else if (key === "quantity") {
      raw[key] = value === "" ? value : Number(value)
    } else {
      raw[key] = value
    }
  }

  const parsed = stockTransferSchema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ")
    return { success: false, error: errors }
  }

  const result = await postStockTransfer(parsed.data)

  if (result.success) {
    revalidatePath("/inventory")
    revalidatePath("/inventory/movements")
  }

  return result
}

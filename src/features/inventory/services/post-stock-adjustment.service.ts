import "server-only"

import { prisma } from "@/lib/prisma"
import type { StockAdjustmentInput } from "@/features/inventory/schemas/stock-adjustment.schema"

export type PostStockAdjustmentResult =
  | { success: true; data: { movementId: number } }
  | { success: false; error: string }

export async function postStockAdjustment(
  input: StockAdjustmentInput
): Promise<PostStockAdjustmentResult> {
  const { productId, warehouseId, quantityDelta, reference, occurredAt } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { isActive: true },
      })

      if (!product) {
        throw new Error("Product not found.")
      }

      if (!product.isActive) {
        throw new Error("Product is inactive.")
      }

      const warehouse = await tx.warehouse.findUnique({
        where: { id: warehouseId },
        select: { isActive: true },
      })

      if (!warehouse) {
        throw new Error("Warehouse not found.")
      }

      if (!warehouse.isActive) {
        throw new Error("Warehouse is inactive.")
      }

      const movement = await tx.stockMovement.create({
        data: {
          type: "ADJUSTMENT",
          status: "POSTED",
          reference,
          occurredAt: occurredAt ?? new Date(),
        },
        select: { id: true },
      })

      await tx.stockMovementLine.create({
        data: {
          movementId: movement.id,
          productId,
          warehouseId,
          quantityDelta,
        },
      })

      const balance = await tx.inventoryBalance.upsert({
        where: {
          productId_warehouseId: { productId, warehouseId },
        },
        create: {
          productId,
          warehouseId,
          quantityOnHand: quantityDelta,
        },
        update: {
          quantityOnHand: { increment: quantityDelta },
        },
        select: { quantityOnHand: true },
      })

      if (Number(balance.quantityOnHand) < 0) {
        throw new Error(
          "Insufficient stock: adjustment would result in negative inventory."
        )
      }

      return { movementId: movement.id }
    })

    return { success: true, data: result }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    throw error
  }
}

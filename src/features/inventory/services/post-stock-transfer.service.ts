import "server-only"

import { prisma } from "@/lib/prisma"
import type { StockTransferInput } from "@/features/inventory/schemas/stock-transfer.schema"

export type PostStockTransferResult =
  | { success: true; data: { movementId: number } }
  | { success: false; error: string }

export async function postStockTransfer(
  input: StockTransferInput
): Promise<PostStockTransferResult> {
  const { productId, fromWarehouseId, toWarehouseId, quantity, reference, occurredAt } = input

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

      const fromWarehouse = await tx.warehouse.findUnique({
        where: { id: fromWarehouseId },
        select: { isActive: true },
      })

      if (!fromWarehouse) {
        throw new Error("Source warehouse not found.")
      }

      if (!fromWarehouse.isActive) {
        throw new Error("Source warehouse is inactive.")
      }

      const toWarehouse = await tx.warehouse.findUnique({
        where: { id: toWarehouseId },
        select: { isActive: true },
      })

      if (!toWarehouse) {
        throw new Error("Destination warehouse not found.")
      }

      if (!toWarehouse.isActive) {
        throw new Error("Destination warehouse is inactive.")
      }

      const movement = await tx.stockMovement.create({
        data: {
          type: "TRANSFER",
          status: "POSTED",
          reference,
          occurredAt: occurredAt ?? new Date(),
        },
        select: { id: true },
      })

      await tx.stockMovementLine.createMany({
        data: [
          {
            movementId: movement.id,
            productId,
            warehouseId: fromWarehouseId,
            quantityDelta: -quantity,
          },
          {
            movementId: movement.id,
            productId,
            warehouseId: toWarehouseId,
            quantityDelta: quantity,
          },
        ],
      })

      const sourceBalance = await tx.inventoryBalance.upsert({
        where: {
          productId_warehouseId: { productId, warehouseId: fromWarehouseId },
        },
        create: {
          productId,
          warehouseId: fromWarehouseId,
          quantityOnHand: -quantity,
        },
        update: {
          quantityOnHand: { increment: -quantity },
        },
        select: { quantityOnHand: true },
      })

      if (Number(sourceBalance.quantityOnHand) < 0) {
        throw new Error(
          "Insufficient stock: transfer would result in negative inventory at the source warehouse."
        )
      }

      await tx.inventoryBalance.upsert({
        where: {
          productId_warehouseId: { productId, warehouseId: toWarehouseId },
        },
        create: {
          productId,
          warehouseId: toWarehouseId,
          quantityOnHand: quantity,
        },
        update: {
          quantityOnHand: { increment: quantity },
        },
      })

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

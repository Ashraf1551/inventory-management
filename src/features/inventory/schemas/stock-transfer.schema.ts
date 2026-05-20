import { z } from "zod"

const positiveNumber = z
  .number()
  .refine((v) => Number.isFinite(v), "Quantity must be a valid number")
  .refine((v) => v > 0, "Quantity must be positive")

export const stockTransferSchema = z
  .object({
    productId: z.number().int().positive("Product ID must be a positive integer"),
    fromWarehouseId: z.number().int().positive("Warehouse ID must be a positive integer"),
    toWarehouseId: z.number().int().positive("Warehouse ID must be a positive integer"),
    quantity: z.union([
      positiveNumber,
      z
        .string()
        .transform((v) => Number(v))
        .pipe(positiveNumber),
    ]),
    reference: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((v) => v || null),
    occurredAt: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined))
      .pipe(z.date().optional()),
  })
  .refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
    message: "Source and destination warehouses must be different",
    path: ["toWarehouseId"],
  })

export type StockTransferInput = z.infer<typeof stockTransferSchema>

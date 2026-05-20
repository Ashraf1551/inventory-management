import { z } from "zod"

const nonZeroNumber = z
  .number()
  .refine((v) => Number.isFinite(v), "Quantity must be a valid number")
  .refine((v) => v !== 0, "Quantity delta must be non-zero")

export const stockAdjustmentSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  warehouseId: z.number().int().positive("Warehouse ID must be a positive integer"),
  quantityDelta: z.union([
    nonZeroNumber,
    z
      .string()
      .transform((v) => Number(v))
      .pipe(nonZeroNumber),
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

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>

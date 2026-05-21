import { z } from "zod"

const positiveDecimal = z
  .number()
  .refine((v) => Number.isFinite(v), "Value must be a valid number")
  .refine((v) => v > 0, "Value must be positive")

const nonNegativeDecimal = z
  .number()
  .refine((v) => Number.isFinite(v), "Value must be a valid number")
  .refine((v) => v >= 0, "Value must be non-negative")

const receiptLineSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  warehouseId: z.number().int().positive("Warehouse ID must be a positive integer"),
  quantity: z.union([
    positiveDecimal,
    z
      .string()
      .transform((v) => Number(v))
      .pipe(positiveDecimal),
  ]),
  unitCost: z.union([
    nonNegativeDecimal,
    z
      .string()
      .transform((v) => Number(v))
      .pipe(nonNegativeDecimal),
  ]),
})

export const createPurchaseReceiptSchema = z.object({
  receiptNumber: z
    .string()
    .trim()
    .min(1, "Receipt number is required")
    .max(50, "Receipt number must be at most 50 characters"),
  supplierId: z.number().int().positive("Supplier ID must be a positive integer"),
  reference: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => v || null),
  receivedAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .pipe(z.date().optional()),
  lines: z.array(receiptLineSchema).min(1, "At least one receipt line is required"),
})

export type CreatePurchaseReceiptInput = z.infer<typeof createPurchaseReceiptSchema>

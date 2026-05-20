import { z } from "zod"

const skuField = z
  .string()
  .trim()
  .min(1, "SKU is required")
  .max(50, "SKU must be at most 50 characters")

const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters")

const descriptionField = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null)

const categoryIdField = z
  .string()
  .optional()
  .transform((v) => (v === undefined || v === "" ? null : Number(v)))
  .pipe(z.union([z.number().int().positive(), z.null()]))
  .default(null)

const lowStockThresholdField = z
  .union([
    z
      .string()
      .transform((v) => (v === "" ? null : Number(v)))
      .pipe(z.union([z.number().finite().nonnegative(), z.null()])),
    z
      .number()
      .finite()
      .nonnegative()
      .nullable()
      .transform((v) => v ?? null),
  ])
  .optional()
  .default(null)

export const createProductSchema = z.object({
  sku: skuField,
  name: nameField,
  description: descriptionField,
  categoryId: categoryIdField,
  lowStockThreshold: lowStockThresholdField,
  isActive: z.boolean().optional().default(true),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export const updateProductSchema = z.object({
  id: z.number(),
  sku: skuField,
  name: nameField,
  description: descriptionField,
  categoryId: categoryIdField,
  lowStockThreshold: lowStockThresholdField,
  isActive: z.boolean().optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

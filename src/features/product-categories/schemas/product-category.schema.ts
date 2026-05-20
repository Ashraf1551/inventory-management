import { z } from "zod"

export const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters")

export const descriptionField = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null)

export const createProductCategorySchema = z.object({
  name: nameField,
  description: descriptionField,
  isActive: z.boolean().optional().default(true),
})

export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>

export const updateProductCategorySchema = z.object({
  id: z.number().int().positive(),
  name: nameField,
  description: descriptionField,
  isActive: z.boolean().optional(),
})

export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>

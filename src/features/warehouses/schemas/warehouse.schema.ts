import { z } from "zod"

export const codeField = z
  .string()
  .trim()
  .min(1, "Code is required")
  .max(20, "Code must be at most 20 characters")

export const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters")

export const addressField = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null)

export const createWarehouseSchema = z.object({
  code: codeField,
  name: nameField,
  address: addressField,
  isActive: z.boolean().optional().default(true),
})

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>

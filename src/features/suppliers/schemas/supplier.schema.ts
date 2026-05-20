import { z } from "zod"

const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(200, "Name must be at most 200 characters")

const emailField = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null)
  .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Invalid email address",
  })

const optionalTextField = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null)

export const createSupplierSchema = z.object({
  name: nameField,
  email: emailField,
  phone: optionalTextField,
  address: optionalTextField,
  isActive: z.boolean().optional().default(true),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>

export const updateSupplierSchema = z.object({
  id: z.number(),
  name: nameField,
  email: emailField,
  phone: optionalTextField,
  address: optionalTextField,
  isActive: z.boolean().optional(),
})

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>

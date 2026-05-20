"use client"

import { useActionState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createProductCategory, type CreateProductCategoryResult } from "@/features/product-categories/actions/create-product-category.action"

export function CreateProductCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CreateProductCategoryResult | null, FormData>(
    createProductCategory,
    null
  )

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4 border rounded p-4 mb-8">
      <h2 className="text-lg font-semibold">New Category</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Category &quot;{state.data.name}&quot; created successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked
          className="h-4 w-4"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Category"}
      </Button>
    </form>
  )
}

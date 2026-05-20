"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateProductCategory, type UpdateProductCategoryResult } from "@/features/product-categories/actions/update-product-category.action"

type Props = {
  category: {
    id: number
    name: string
    description: string | null
    isActive: boolean
  }
}

export function UpdateProductCategoryForm({ category }: Props) {
  const [state, formAction, isPending] = useActionState<UpdateProductCategoryResult | null, FormData>(
    updateProductCategory,
    null
  )

  return (
    <form action={formAction} className="space-y-4 border rounded p-4">
      <h2 className="text-lg font-semibold">Edit Category</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Category &quot;{state.data.name}&quot; updated successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <input type="hidden" name="id" value={category.id} />

      <div>
        <Label htmlFor="update-name">Name</Label>
        <Input id="update-name" name="name" type="text" required defaultValue={category.name} />
      </div>

      <div>
        <Label htmlFor="update-description">Description</Label>
        <Textarea id="update-description" name="description" rows={3} defaultValue={category.description ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="update-isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={category.isActive}
          className="h-4 w-4"
        />
        <Label htmlFor="update-isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

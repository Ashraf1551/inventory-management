"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { updateProduct, type UpdateProductResult } from "@/features/products/actions/update-product.action"
import type { ActiveProductCategoryOption } from "@/features/product-categories/queries/list-active-product-categories.query"

type Props = {
  product: {
    id: number
    sku: string
    name: string
    description: string | null
    category: { id: number } | null
    isActive: boolean
  }
  categories: ActiveProductCategoryOption[]
}

export function UpdateProductForm({ product, categories }: Props) {
  const [state, formAction, isPending] = useActionState<UpdateProductResult | null, FormData>(
    updateProduct,
    null
  )

  return (
    <form action={formAction} className="space-y-4 border rounded p-4">
      <h2 className="text-lg font-semibold">Edit Product</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Product &quot;{state.data.name}&quot; updated successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <input type="hidden" name="id" value={product.id} />

      <div>
        <Label htmlFor="update-sku">SKU</Label>
        <Input id="update-sku" name="sku" type="text" required defaultValue={product.sku} />
      </div>

      <div>
        <Label htmlFor="update-name">Name</Label>
        <Input id="update-name" name="name" type="text" required defaultValue={product.name} />
      </div>

      <div>
        <Label htmlFor="update-description">Description</Label>
        <Textarea id="update-description" name="description" rows={3} defaultValue={product.description ?? ""} />
      </div>

      <div>
        <Label htmlFor="update-categoryId">Category</Label>
        <select
          id="update-categoryId"
          name="categoryId"
          defaultValue={product.category?.id ?? ""}
          className={cn(
            "flex h-9 w-full rounded-4xl border border-input bg-transparent px-3 py-1 text-base shadow-xs",
            "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3",
            "focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            "appearance-none text-foreground"
          )}
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="update-isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={product.isActive}
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

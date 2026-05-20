"use client"

import { useActionState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createProduct, type CreateProductResult } from "@/features/products/actions/create-product.action"
import type { ActiveProductCategoryOption } from "@/features/product-categories/queries/list-active-product-categories.query"

type Props = {
  categories: ActiveProductCategoryOption[]
}

export function CreateProductForm({ categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CreateProductResult | null, FormData>(
    createProduct,
    null
  )

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4 border rounded p-4 mb-8">
      <h2 className="text-lg font-semibold">New Product</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Product &quot;{state.data.name}&quot; created successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" name="sku" type="text" required />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div>
        <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
        <Input id="lowStockThreshold" name="lowStockThreshold" type="text" placeholder="Optional minimum stock level..." />
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
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
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked
          className="h-4 w-4"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
}

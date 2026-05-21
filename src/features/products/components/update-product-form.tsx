"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { updateProduct, type UpdateProductResult } from "@/features/products/actions/update-product.action"
import type { ActiveProductCategoryOption } from "@/features/product-categories/queries/list-active-product-categories.query"

type Props = {
  product: {
    id: number
    sku: string
    name: string
    description: string | null
    lowStockThreshold: number | null
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
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Product &quot;{state.data.name}&quot; updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <input type="hidden" name="id" value={product.id} />

          <div className="space-y-2">
            <Label htmlFor="update-sku">SKU</Label>
            <Input id="update-sku" name="sku" type="text" required defaultValue={product.sku} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-name">Name</Label>
            <Input id="update-name" name="name" type="text" required defaultValue={product.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-description">Description</Label>
            <Textarea id="update-description" name="description" rows={3} defaultValue={product.description ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-low-stock-threshold">Low Stock Threshold</Label>
            <Input id="update-low-stock-threshold" name="lowStockThreshold" type="text" placeholder="Optional minimum stock level..." defaultValue={product.lowStockThreshold ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-categoryId">Category</Label>
            <Select name="categoryId" defaultValue={String(product.category?.id ?? "")}>
              <SelectTrigger className="w-full" id="update-categoryId">
                <SelectValue placeholder="No category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="update-isActive" name="isActive" defaultChecked={product.isActive} />
            <Label htmlFor="update-isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

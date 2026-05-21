"use client"

import { useActionState, useRef, useEffect } from "react"
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Product &quot;{state.data.name}&quot; created successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input id="lowStockThreshold" name="lowStockThreshold" type="text" placeholder="Optional minimum stock level..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue="">
              <SelectTrigger className="w-full" id="categoryId">
                <SelectValue placeholder="No category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

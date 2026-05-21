"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Category &quot;{state.data.name}&quot; updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
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
            <Checkbox id="update-isActive" name="isActive" defaultChecked={category.isActive} />
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

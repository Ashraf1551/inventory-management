"use client"

import { useActionState, useRef, useEffect } from "react"
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Category &quot;{state.data.name}&quot; created successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

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
import { createSupplier, type CreateSupplierResult } from "@/features/suppliers/actions/create-supplier.action"

export function CreateSupplierForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CreateSupplierResult | null, FormData>(
    createSupplier,
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
        <CardTitle>New Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Supplier &quot;{state.data.name}&quot; created successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="supplier-name">Name</Label>
            <Input id="supplier-name" name="name" type="text" required />
          </div>

          <div>
            <Label htmlFor="supplier-email">Email</Label>
            <Input id="supplier-email" name="email" type="email" placeholder="Optional..." />
          </div>

          <div>
            <Label htmlFor="supplier-phone">Phone</Label>
            <Input id="supplier-phone" name="phone" type="text" placeholder="Optional..." />
          </div>

          <div>
            <Label htmlFor="supplier-address">Address</Label>
            <Textarea id="supplier-address" name="address" rows={2} placeholder="Optional..." />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="supplier-isActive" name="isActive" defaultChecked />
            <Label htmlFor="supplier-isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Supplier"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

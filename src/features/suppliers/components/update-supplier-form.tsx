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
import { updateSupplier, type UpdateSupplierResult } from "@/features/suppliers/actions/update-supplier.action"
import type { GetSupplierResult } from "@/features/suppliers/queries/get-supplier.query"

type Props = {
  supplier: NonNullable<GetSupplierResult>
}

export function UpdateSupplierForm({ supplier }: Props) {
  const [state, formAction, isPending] = useActionState<UpdateSupplierResult | null, FormData>(
    updateSupplier,
    null
  )

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Edit Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Supplier &quot;{state.data.name}&quot; updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <input type="hidden" name="id" value={supplier.id} />

          <div className="space-y-2">
            <Label htmlFor="edit-supplier-name">Name</Label>
            <Input id="edit-supplier-name" name="name" type="text" required defaultValue={supplier.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-supplier-email">Email</Label>
            <Input id="edit-supplier-email" name="email" type="email" placeholder="Optional..." defaultValue={supplier.email ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-supplier-phone">Phone</Label>
            <Input id="edit-supplier-phone" name="phone" type="text" placeholder="Optional..." defaultValue={supplier.phone ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-supplier-address">Address</Label>
            <Textarea id="edit-supplier-address" name="address" rows={2} placeholder="Optional..." defaultValue={supplier.address ?? ""} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="edit-supplier-isActive" name="isActive" defaultChecked={supplier.isActive} />
            <Label htmlFor="edit-supplier-isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

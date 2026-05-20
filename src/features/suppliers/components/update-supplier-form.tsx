"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
    <form action={formAction} className="space-y-4 border rounded p-4 mb-8">
      <h2 className="text-lg font-semibold">Edit Supplier</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Supplier &quot;{state.data.name}&quot; updated successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <input type="hidden" name="id" value={supplier.id} />

      <div>
        <Label htmlFor="edit-supplier-name">Name</Label>
        <Input id="edit-supplier-name" name="name" type="text" required defaultValue={supplier.name} />
      </div>

      <div>
        <Label htmlFor="edit-supplier-email">Email</Label>
        <Input id="edit-supplier-email" name="email" type="email" placeholder="Optional..." defaultValue={supplier.email ?? ""} />
      </div>

      <div>
        <Label htmlFor="edit-supplier-phone">Phone</Label>
        <Input id="edit-supplier-phone" name="phone" type="text" placeholder="Optional..." defaultValue={supplier.phone ?? ""} />
      </div>

      <div>
        <Label htmlFor="edit-supplier-address">Address</Label>
        <Textarea id="edit-supplier-address" name="address" rows={2} placeholder="Optional..." defaultValue={supplier.address ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="edit-supplier-isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={supplier.isActive}
          className="h-4 w-4"
        />
        <Label htmlFor="edit-supplier-isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

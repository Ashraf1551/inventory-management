"use client"

import { useActionState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
    <form ref={formRef} action={formAction} className="space-y-4 border rounded p-4 mb-8">
      <h2 className="text-lg font-semibold">New Supplier</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Supplier &quot;{state.data.name}&quot; created successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
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
        <input
          id="supplier-isActive"
          name="isActive"
          type="checkbox"
          defaultChecked
          className="h-4 w-4"
        />
        <Label htmlFor="supplier-isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Supplier"}
      </Button>
    </form>
  )
}

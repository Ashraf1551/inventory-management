"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateWarehouse, type UpdateWarehouseResult } from "@/features/warehouses/actions/update-warehouse.action"

type Props = {
  warehouse: {
    id: number
    code: string
    name: string
    address: string | null
    isActive: boolean
  }
}

export function UpdateWarehouseForm({ warehouse }: Props) {
  const [state, formAction, isPending] = useActionState<UpdateWarehouseResult | null, FormData>(
    updateWarehouse,
    null
  )

  return (
    <form action={formAction} className="space-y-4 border rounded p-4">
      <h2 className="text-lg font-semibold">Edit Warehouse</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Warehouse &quot;{state.data.name}&quot; updated successfully.
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <input type="hidden" name="id" value={warehouse.id} />

      <div>
        <Label htmlFor="update-code">Code</Label>
        <Input id="update-code" name="code" type="text" required defaultValue={warehouse.code} />
      </div>

      <div>
        <Label htmlFor="update-name">Name</Label>
        <Input id="update-name" name="name" type="text" required defaultValue={warehouse.name} />
      </div>

      <div>
        <Label htmlFor="update-address">Address</Label>
        <Textarea id="update-address" name="address" rows={3} defaultValue={warehouse.address ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="update-isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={warehouse.isActive}
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

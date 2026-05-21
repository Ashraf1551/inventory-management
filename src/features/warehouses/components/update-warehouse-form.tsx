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
    <Card>
      <CardHeader>
        <CardTitle>Edit Warehouse</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Warehouse &quot;{state.data.name}&quot; updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
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
            <Checkbox id="update-isActive" name="isActive" defaultChecked={warehouse.isActive} />
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

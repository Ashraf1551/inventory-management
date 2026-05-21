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
import { createWarehouse, type CreateWarehouseResult } from "@/features/warehouses/actions/create-warehouse.action"

export function CreateWarehouseForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CreateWarehouseResult | null, FormData>(
    createWarehouse,
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
        <CardTitle>New Warehouse</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Warehouse &quot;{state.data.name}&quot; created successfully.
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" name="code" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" rows={3} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Warehouse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

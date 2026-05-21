"use client"

import { useActionState, useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
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
import { createStockAdjustment, type CreateStockAdjustmentResult } from "@/features/inventory/actions/create-stock-adjustment.action"
import type { ActiveProductOption } from "@/features/products/queries/list-active-products.query"
import type { ActiveWarehouseOption } from "@/features/warehouses/queries/list-active-warehouses.query"

type Props = {
  products: ActiveProductOption[]
  warehouses: ActiveWarehouseOption[]
}

export function StockAdjustmentForm({ products, warehouses }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [occurredAt, setOccurredAt] = useState("")
  const [state, formAction, isPending] = useActionState<CreateStockAdjustmentResult | null, FormData>(
    createStockAdjustment,
    null
  )

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setOccurredAt("")
    }
  }, [state])

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Stock Adjustment</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Adjustment posted (Movement #{state.data.movementId}).
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="adjustment-product-id">Product</Label>
            <Select name="productId" defaultValue="">
              <SelectTrigger className="w-full" id="adjustment-product-id">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.sku} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="adjustment-warehouse-id">Warehouse</Label>
            <Select name="warehouseId" defaultValue="">
              <SelectTrigger className="w-full" id="adjustment-warehouse-id">
                <SelectValue placeholder="Select a warehouse..." />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>
                    {w.code} — {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantityDelta">Quantity Delta</Label>
            <Input id="quantityDelta" name="quantityDelta" type="text" required placeholder="e.g. 10 or -5" />
          </div>

          <div>
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" name="reference" type="text" placeholder="Optional reference..." />
          </div>

          <div>
            <Label htmlFor="occurredAt">Occurred Date</Label>
            <DatePicker id="occurredAt" name="occurredAt" value={occurredAt} onChange={setOccurredAt} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post Adjustment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

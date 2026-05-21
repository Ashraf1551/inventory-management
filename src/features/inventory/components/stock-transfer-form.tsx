"use client"

import { useActionState, useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { createStockTransfer, type CreateStockTransferResult } from "@/features/inventory/actions/create-stock-transfer.action"
import type { ActiveProductOption } from "@/features/products/queries/list-active-products.query"
import type { ActiveWarehouseOption } from "@/features/warehouses/queries/list-active-warehouses.query"

type Props = {
  products: ActiveProductOption[]
  warehouses: ActiveWarehouseOption[]
}

export function StockTransferForm({ products, warehouses }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CreateStockTransferResult | null, FormData>(
    createStockTransfer,
    null
  )
  const [fromWarehouseId, setFromWarehouseId] = useState("")

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setFromWarehouseId("")
    }
  }, [state])

  const destWarehouses = warehouses.filter((w) => String(w.id) !== fromWarehouseId)

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Stock Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.success && (
            <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
              <AlertDescription>
                Transfer posted (Movement #{state.data.movementId}).
              </AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="transfer-product-id">Product</Label>
            <Select name="productId" defaultValue="">
              <SelectTrigger className="w-full" id="transfer-product-id">
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
            <Label htmlFor="transfer-from-warehouse">Source Warehouse</Label>
            <Select
              name="fromWarehouseId"
              value={fromWarehouseId}
              onValueChange={(v) => setFromWarehouseId(v ?? "")}
            >
              <SelectTrigger className="w-full" id="transfer-from-warehouse">
                <SelectValue placeholder="Select source warehouse..." />
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
            <Label htmlFor="transfer-to-warehouse">Destination Warehouse</Label>
            <Select name="toWarehouseId" defaultValue="">
              <SelectTrigger className="w-full" id="transfer-to-warehouse">
                <SelectValue placeholder="Select destination warehouse..." />
              </SelectTrigger>
              <SelectContent>
                {destWarehouses.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>
                    {w.code} — {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      <div>
        <Label htmlFor="transfer-quantity">Quantity</Label>
        <Input id="transfer-quantity" name="quantity" type="text" required placeholder="e.g. 10" />
      </div>

      <div>
        <Label htmlFor="transfer-reference">Reference</Label>
        <Input id="transfer-reference" name="reference" type="text" placeholder="Optional reference..." />
      </div>

      <div>
        <Label htmlFor="transfer-occurred-at">Occurred Date</Label>
        <Input id="transfer-occurred-at" name="occurredAt" type="date" />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Posting..." : "Post Transfer"}
      </Button>
      </form>
      </CardContent>
    </Card>
  )
}

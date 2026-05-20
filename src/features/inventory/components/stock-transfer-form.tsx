"use client"

import { useActionState, useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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

  const selectClass = cn(
    "flex h-9 w-full rounded-4xl border border-input bg-transparent px-3 py-1 text-base shadow-xs",
    "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "appearance-none text-foreground"
  )

  const destWarehouses = warehouses.filter((w) => String(w.id) !== fromWarehouseId)

  return (
    <form ref={formRef} action={formAction} className="space-y-4 border rounded p-4 mb-8">
      <h2 className="text-lg font-semibold">Stock Transfer</h2>

      {state?.success && (
        <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
          Transfer posted (Movement #{state.data.movementId}).
        </p>
      )}

      {state && !state.success && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="transfer-product-id">Product</Label>
        <select id="transfer-product-id" name="productId" required className={selectClass}>
          <option value="">Select a product...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.sku} — {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="transfer-from-warehouse">Source Warehouse</Label>
        <select
          id="transfer-from-warehouse"
          name="fromWarehouseId"
          required
          className={selectClass}
          value={fromWarehouseId}
          onChange={(e) => setFromWarehouseId(e.target.value)}
        >
          <option value="">Select source warehouse...</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.code} — {w.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="transfer-to-warehouse">Destination Warehouse</Label>
        <select id="transfer-to-warehouse" name="toWarehouseId" required className={selectClass}>
          <option value="">Select destination warehouse...</option>
          {destWarehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.code} — {w.name}
            </option>
          ))}
        </select>
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
  )
}

"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"

type Props = {
  search: string
  type: string
  status: string
  productId: string
  warehouseId: string
  from: string
  to: string
}

export function MovementDateFilter({ search, type, status, productId, warehouseId, from: initialFrom, to: initialTo }: Props) {
  const [from, setFrom] = useState(initialFrom ?? "")
  const [to, setTo] = useState(initialTo ?? "")

  return (
    <form action="/inventory/movements" className="flex items-center gap-2">
      <input type="hidden" name="search" value={search ?? ""} />
      <input type="hidden" name="type" value={type ?? ""} />
      <input type="hidden" name="status" value={status ?? ""} />
      <input type="hidden" name="productId" value={productId ?? ""} />
      <input type="hidden" name="warehouseId" value={warehouseId ?? ""} />
      <Label htmlFor="movements-from">
        From
      </Label>
      <DatePicker id="movements-from" name="from" value={from} onChange={setFrom} className="max-w-40" />
      <Label htmlFor="movements-to">
        To
      </Label>
      <DatePicker id="movements-to" name="to" value={to} onChange={setTo} className="max-w-40" />
      <Button type="submit" size="xs">
        Filter
      </Button>
    </form>
  )
}

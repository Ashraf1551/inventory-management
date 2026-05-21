"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { reactivateWarehouse } from "@/features/warehouses/actions/reactivate-warehouse.action"

type Props = {
  warehouseId: number
  warehouseName: string
}

export function ReactivateWarehouseButton({ warehouseId, warehouseName }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleReactivate() {
    setError(null)
    setShowConfirm(true)
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await reactivateWarehouse(warehouseId)
      if (result.success) {
        setSuccess(true)
        setShowConfirm(false)
      } else {
        setError(result.error)
        setShowConfirm(false)
      }
    })
  }

  function handleCancel() {
    setShowConfirm(false)
  }

  if (success) {
    return (
      <Alert variant="default" className="border-green-300 bg-green-50 text-green-800">
        <AlertDescription>Warehouse reactivated.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">Reactivate &quot;{warehouseName}&quot;?</span>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            size="xs"
          >
            {isPending ? "Reactivating..." : "Confirm"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isPending}
            variant="outline"
            size="xs"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={handleReactivate} size="xs">
          Reactivate
        </Button>
      )}
    </div>
  )
}

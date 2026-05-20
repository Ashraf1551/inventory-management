"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deactivateSupplier } from "@/features/suppliers/actions/deactivate-supplier.action"

type Props = {
  supplierId: number
  supplierName: string
}

export function DeactivateSupplierButton({ supplierId, supplierName }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDeactivate() {
    setError(null)
    setShowConfirm(true)
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deactivateSupplier(supplierId)
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
      <p className="text-green-700 bg-green-100 border border-green-300 rounded px-3 py-2">
        Supplier deactivated.
      </p>
    )
  }

  return (
    <div>
      {error && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {showConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">Deactivate &quot;{supplierName}&quot;?</span>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            size="xs"
          >
            {isPending ? "Deactivating..." : "Confirm"}
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
        <Button onClick={handleDeactivate} size="xs">
          Deactivate
        </Button>
      )}
    </div>
  )
}

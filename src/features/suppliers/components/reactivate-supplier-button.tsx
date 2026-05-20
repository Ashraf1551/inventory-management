"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { reactivateSupplier } from "@/features/suppliers/actions/reactivate-supplier.action"

type Props = {
  supplierId: number
  supplierName: string
}

export function ReactivateSupplierButton({ supplierId, supplierName }: Props) {
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
      const result = await reactivateSupplier(supplierId)
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
        Supplier reactivated.
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
          <span className="text-sm">Reactivate &quot;{supplierName}&quot;?</span>
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

"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { deactivateProduct } from "@/features/products/actions/deactivate-product.action"

type Props = {
  productId: number
  productName: string
}

export function DeactivateProductButton({ productId, productName }: Props) {
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
      const result = await deactivateProduct(productId)
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
        <AlertDescription>Product deactivated.</AlertDescription>
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
          <span className="text-sm">Deactivate &quot;{productName}&quot;?</span>
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

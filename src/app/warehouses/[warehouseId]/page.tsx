import Link from "next/link"
import { notFound } from "next/navigation"
import { getWarehouse } from "@/features/warehouses/queries/get-warehouse.query"
import { UpdateWarehouseForm } from "@/features/warehouses/components/update-warehouse-form"
import { DeactivateWarehouseButton } from "@/features/warehouses/components/deactivate-warehouse-button"
import { ReactivateWarehouseButton } from "@/features/warehouses/components/reactivate-warehouse-button"

type Props = {
  params: Promise<{ warehouseId: string }>
}

export default async function WarehouseDetailPage({ params }: Props) {
  const { warehouseId } = await params
  const warehouse = await getWarehouse(Number(warehouseId))

  if (!warehouse) notFound()

  return (
    <div className="p-6">
      <Link href="/warehouses" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to Warehouses
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">{warehouse.name}</h1>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <dt className="font-semibold">Code</dt>
            <dd>{warehouse.code}</dd>

            <dt className="font-semibold">Name</dt>
            <dd>{warehouse.name}</dd>

            <dt className="font-semibold">Address</dt>
            <dd>{warehouse.address ?? "—"}</dd>

            <dt className="font-semibold">Status</dt>
            <dd>
              {warehouse.isActive ? "Active" : "Inactive"}
              {warehouse.isActive ? (
                <div className="mt-2">
                  <DeactivateWarehouseButton
                    warehouseId={warehouse.id}
                    warehouseName={warehouse.name}
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <ReactivateWarehouseButton
                    warehouseId={warehouse.id}
                    warehouseName={warehouse.name}
                  />
                </div>
              )}
            </dd>

            <dt className="font-semibold">Created</dt>
            <dd>{warehouse.createdAt.toLocaleDateString()}</dd>

            <dt className="font-semibold">Updated</dt>
            <dd>{warehouse.updatedAt.toLocaleDateString()}</dd>
          </dl>
        </div>

        <div>
          <UpdateWarehouseForm warehouse={warehouse} />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
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
      <Link href="/warehouses" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
        &larr; Back to Warehouses
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{warehouse.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold w-32">Code</TableCell>
                    <TableCell>{warehouse.code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell>{warehouse.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Address</TableCell>
                    <TableCell>{warehouse.address ?? "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Created</TableCell>
                    <TableCell>{warehouse.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Updated</TableCell>
                    <TableCell>{warehouse.updatedAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <UpdateWarehouseForm warehouse={warehouse} />
        </div>
      </div>
    </div>
  )
}

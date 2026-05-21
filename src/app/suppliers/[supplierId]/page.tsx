import Link from "next/link"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
import { getSupplier } from "@/features/suppliers/queries/get-supplier.query"
import { UpdateSupplierForm } from "@/features/suppliers/components/update-supplier-form"
import { DeactivateSupplierButton } from "@/features/suppliers/components/deactivate-supplier-button"
import { ReactivateSupplierButton } from "@/features/suppliers/components/reactivate-supplier-button"

type Props = {
  params: Promise<{ supplierId: string }>
}

export default async function SupplierDetailPage({ params }: Props) {
  const { supplierId } = await params
  const supplier = await getSupplier(Number(supplierId))

  if (!supplier) notFound()

  return (
    <div className="p-6">
      <Link href="/suppliers" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
        &larr; Back to Suppliers
      </Link>

      <UpdateSupplierForm supplier={supplier} />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{supplier.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold w-32">Name</TableCell>
                <TableCell>{supplier.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell>{supplier.email ?? "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Phone</TableCell>
                <TableCell>{supplier.phone ?? "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Address</TableCell>
                <TableCell>{supplier.address ?? "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell>
                  {supplier.isActive ? "Active" : "Inactive"}
                  {supplier.isActive ? (
                    <DeactivateSupplierButton supplierId={supplier.id} supplierName={supplier.name} />
                  ) : (
                    <ReactivateSupplierButton supplierId={supplier.id} supplierName={supplier.name} />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Created</TableCell>
                <TableCell>{supplier.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Updated</TableCell>
                <TableCell>{supplier.updatedAt.toLocaleDateString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

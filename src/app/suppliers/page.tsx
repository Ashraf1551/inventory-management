import Link from "next/link"
import Form from "next/form"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { listSuppliers } from "@/features/suppliers/queries/list-suppliers.query"
import { CreateSupplierForm } from "@/features/suppliers/components/create-supplier-form"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string, status?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  if (status) params.set("status", status)
  return `${base}?${params.toString()}`
}

export default async function SuppliersPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const status = params.status || undefined
  const result = await listSuppliers({
    search,
    status: (status as "all" | "active" | "inactive" | undefined),
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const baseUrl = "/suppliers"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>

      <CreateSupplierForm />

      <Form action="/suppliers" className="flex gap-2 mb-4">
        <Input
          name="search"
          placeholder="Search by name, email, or phone..."
          defaultValue={search}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </Form>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">Status:</span>
        <form action="/suppliers" className="flex gap-1">
          <input type="hidden" name="search" value={search ?? ""} />
          <Button type="submit" name="status" value="all" variant={!status || status === "all" ? "default" : "outline"} size="xs">All</Button>
          <Button type="submit" name="status" value="active" variant={status === "active" ? "default" : "outline"} size="xs">Active</Button>
          <Button type="submit" name="status" value="inactive" variant={status === "inactive" ? "default" : "outline"} size="xs">Inactive</Button>
        </form>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No suppliers found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <Link href={`/suppliers/${supplier.id}`} className="hover:underline font-medium">
                    {supplier.name}
                  </Link>
                </TableCell>
                <TableCell>{supplier.email ?? "—"}</TableCell>
                <TableCell>{supplier.phone ?? "—"}</TableCell>
                <TableCell>{supplier.address ?? "—"}</TableCell>
                <TableCell>{supplier.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>{supplier.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <a
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search, status)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Previous
          </a>
        ) : (
          <Button variant="outline" disabled>
            Previous
          </Button>
        )}

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        {pagination.page < pagination.totalPages ? (
          <a
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search, status)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Next
          </a>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

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
import { CreateWarehouseForm } from "@/features/warehouses/components/create-warehouse-form"
import { listWarehouses } from "@/features/warehouses/queries/list-warehouses.query"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string, status?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  if (status) params.set("status", status)
  return `${base}?${params.toString()}`
}

export default async function WarehousesPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const status = params.status || undefined
  const result = await listWarehouses({
    search,
    status: (status as "all" | "active" | "inactive" | undefined),
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const baseUrl = "/warehouses"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Warehouses</h1>

      <CreateWarehouseForm />

      <div className="mb-4 space-y-3">
        <Form action="/warehouses" className="flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <Input
            name="search"
            type="search"
            defaultValue={search ?? ""}
            placeholder="Search by code or name..."
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </Form>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <form action="/warehouses" className="flex gap-1">
            <input type="hidden" name="search" value={search ?? ""} />
            <Button type="submit" name="status" value="all" variant={!status || status === "all" ? "default" : "outline"} size="xs">All</Button>
            <Button type="submit" name="status" value="active" variant={status === "active" ? "default" : "outline"} size="xs">Active</Button>
            <Button type="submit" name="status" value="inactive" variant={status === "inactive" ? "default" : "outline"} size="xs">Inactive</Button>
          </form>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((warehouse) => (
            <TableRow key={warehouse.id}>
              <TableCell>
                <Link href={`/warehouses/${warehouse.id}`} className="hover:underline">
                  {warehouse.code}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/warehouses/${warehouse.id}`} className="hover:underline">
                  {warehouse.name}
                </Link>
              </TableCell>
              <TableCell>{warehouse.address ?? "—"}</TableCell>
              <TableCell>
                {warehouse.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell>
                {warehouse.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No warehouses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <Link
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search, status)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Previous
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Previous
          </Button>
        )}

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        {pagination.page < pagination.totalPages ? (
          <Link
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search, status)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Next
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

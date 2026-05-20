import Form from "next/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { listLowStockBalances } from "@/features/inventory/queries/list-low-stock-balances.query"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  return `${base}?${params.toString()}`
}

export default async function LowStockPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const result = await listLowStockBalances({
    search,
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const baseUrl = "/inventory/low-stock"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Low Stock Inventory</h1>

      <Form action="/inventory/low-stock" className="flex gap-2 mb-4">
        <Input
          name="search"
          placeholder="Search by SKU, product name, warehouse code, or warehouse name..."
          defaultValue={search}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Warehouse Code</TableHead>
            <TableHead>Qty On Hand</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No low stock balances found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.product.sku}</TableCell>
                <TableCell>{row.product.name}</TableCell>
                <TableCell>{row.warehouse.name}</TableCell>
                <TableCell>{row.warehouse.code}</TableCell>
                <TableCell>{row.quantityOnHand}</TableCell>
                <TableCell>{row.product.lowStockThreshold}</TableCell>
                <TableCell>{row.updatedAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <a
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search)}
            className="px-3 py-1 border rounded hover:bg-muted"
          >
            Previous
          </a>
        ) : (
          <span className="px-3 py-1 border rounded text-muted-foreground">
            Previous
          </span>
        )}

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        {pagination.page < pagination.totalPages ? (
          <a
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search)}
            className="px-3 py-1 border rounded hover:bg-muted"
          >
            Next
          </a>
        ) : (
          <span className="px-3 py-1 border rounded text-muted-foreground">
            Next
          </span>
        )}
      </div>
    </div>
  )
}

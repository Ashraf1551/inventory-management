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
import { listActiveProducts } from "@/features/products/queries/list-active-products.query"
import { listActiveWarehouses } from "@/features/warehouses/queries/list-active-warehouses.query"
import { listStockMovements } from "@/features/inventory/queries/list-stock-movements.query"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; type?: string; status?: string; productId?: string; warehouseId?: string; from?: string; to?: string }>
}

const MOVEMENT_TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "ADJUSTMENT", label: "Adjustment" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "PURCHASE_RECEIPT", label: "Purchase Receipt" },
  { value: "SALES_ISSUE", label: "Sales Issue" },
] as const

const MOVEMENT_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "POSTED", label: "Posted" },
  { value: "VOIDED", label: "Voided" },
] as const

function paginationHref(base: string, page: number, pageSize: number, search?: string, type?: string, status?: string, productId?: string, warehouseId?: string, from?: string, to?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  if (type) params.set("type", type)
  if (status) params.set("status", status)
  if (productId) params.set("productId", productId)
  if (warehouseId) params.set("warehouseId", warehouseId)
  if (from) params.set("from", from)
  if (to) params.set("to", to)
  return `${base}?${params.toString()}`
}

export default async function MovementsPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const currentType = params.type || undefined
  const currentStatus = params.status || undefined
  const currentProductId = params.productId || undefined
  const currentWarehouseId = params.warehouseId || undefined
  const currentFrom = params.from || undefined
  const currentTo = params.to || undefined
  const result = await listStockMovements({
    search,
    type: currentType,
    status: currentStatus,
    productId: currentProductId,
    warehouseId: currentWarehouseId,
    from: currentFrom,
    to: currentTo,
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const [products, warehouses] = await Promise.all([
    listActiveProducts(),
    listActiveWarehouses(),
  ])
  const baseUrl = "/inventory/movements"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Movement History</h1>

      <Form action="/inventory/movements" className="flex gap-2 mb-4">
        <input type="hidden" name="type" value={currentType ?? ""} />
        <input type="hidden" name="status" value={currentStatus ?? ""} />
        <input type="hidden" name="productId" value={currentProductId ?? ""} />
        <input type="hidden" name="warehouseId" value={currentWarehouseId ?? ""} />
        <input type="hidden" name="from" value={currentFrom ?? ""} />
        <input type="hidden" name="to" value={currentTo ?? ""} />
        <Input
          name="search"
          placeholder="Search by reference, product, or warehouse..."
          defaultValue={search}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </Form>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <form action="/inventory/movements" className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="status" value={currentStatus ?? ""} />
          <input type="hidden" name="productId" value={currentProductId ?? ""} />
          <input type="hidden" name="warehouseId" value={currentWarehouseId ?? ""} />
          <input type="hidden" name="from" value={currentFrom ?? ""} />
          <input type="hidden" name="to" value={currentTo ?? ""} />
          <span className="text-sm font-medium">Type:</span>
          {MOVEMENT_TYPE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="submit"
              name="type"
              value={opt.value}
              variant={currentType === opt.value || (!currentType && opt.value === "") ? "default" : "outline"}
              size="xs"
            >
              {opt.label}
            </Button>
          ))}
        </form>

        <form action="/inventory/movements" className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="type" value={currentType ?? ""} />
          <input type="hidden" name="productId" value={currentProductId ?? ""} />
          <input type="hidden" name="warehouseId" value={currentWarehouseId ?? ""} />
          <input type="hidden" name="from" value={currentFrom ?? ""} />
          <input type="hidden" name="to" value={currentTo ?? ""} />
          <span className="text-sm font-medium">Status:</span>
          {MOVEMENT_STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="submit"
              name="status"
              value={opt.value}
              variant={currentStatus === opt.value || (!currentStatus && opt.value === "") ? "default" : "outline"}
              size="xs"
            >
              {opt.label}
            </Button>
          ))}
        </form>

        <form action="/inventory/movements" className="flex items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="type" value={currentType ?? ""} />
          <input type="hidden" name="status" value={currentStatus ?? ""} />
          <input type="hidden" name="warehouseId" value={currentWarehouseId ?? ""} />
          <input type="hidden" name="from" value={currentFrom ?? ""} />
          <input type="hidden" name="to" value={currentTo ?? ""} />
          <label htmlFor="movements-product-filter" className="text-sm font-medium whitespace-nowrap">
            Product
          </label>
          <select
            id="movements-product-filter"
            name="productId"
            className="flex h-9 w-full max-w-xs rounded-4xl border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:border-ring appearance-none text-foreground"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={String(p.id)} selected={currentProductId === String(p.id)}>
                {p.sku} — {p.name}
              </option>
            ))}
          </select>
          <Button type="submit" size="xs">
            Filter
          </Button>
        </form>

        <form action="/inventory/movements" className="flex items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="type" value={currentType ?? ""} />
          <input type="hidden" name="status" value={currentStatus ?? ""} />
          <input type="hidden" name="productId" value={currentProductId ?? ""} />
          <input type="hidden" name="from" value={currentFrom ?? ""} />
          <input type="hidden" name="to" value={currentTo ?? ""} />
          <label htmlFor="movements-warehouse-filter" className="text-sm font-medium whitespace-nowrap">
            Warehouse
          </label>
          <select
            id="movements-warehouse-filter"
            name="warehouseId"
            className="flex h-9 w-full max-w-xs rounded-4xl border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:border-ring appearance-none text-foreground"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={String(w.id)} selected={currentWarehouseId === String(w.id)}>
                {w.code} — {w.name}
              </option>
            ))}
          </select>
          <Button type="submit" size="xs">
            Filter
          </Button>
        </form>

        <form action="/inventory/movements" className="flex items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="type" value={currentType ?? ""} />
          <input type="hidden" name="status" value={currentStatus ?? ""} />
          <input type="hidden" name="productId" value={currentProductId ?? ""} />
          <input type="hidden" name="warehouseId" value={currentWarehouseId ?? ""} />
          <label htmlFor="movements-from" className="text-sm font-medium whitespace-nowrap">
            From
          </label>
          <Input
            id="movements-from"
            name="from"
            type="date"
            defaultValue={currentFrom ?? ""}
            className="max-w-40"
          />
          <label htmlFor="movements-to" className="text-sm font-medium whitespace-nowrap">
            To
          </label>
          <Input
            id="movements-to"
            name="to"
            type="date"
            defaultValue={currentTo ?? ""}
            className="max-w-40"
          />
          <Button type="submit" size="xs">
            Filter
          </Button>
        </form>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Occurred</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Warehouse Code</TableHead>
            <TableHead>Qty Delta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No stock movements found.
              </TableCell>
            </TableRow>
          ) : (
            rows.flatMap((movement) =>
              movement.lines.length === 0
                ? [
                    <TableRow key={movement.id}>
                      <TableCell>{movement.type}</TableCell>
                      <TableCell>{movement.status}</TableCell>
                      <TableCell>{movement.reference ?? "—"}</TableCell>
                      <TableCell>{movement.occurredAt.toLocaleDateString()}</TableCell>
                      <TableCell colSpan={5} className="text-muted-foreground">
                        No lines
                      </TableCell>
                    </TableRow>,
                  ]
                : movement.lines.map((line) => (
                    <TableRow key={`${movement.id}-${line.id}`}>
                      <TableCell>{movement.type}</TableCell>
                      <TableCell>{movement.status}</TableCell>
                      <TableCell>{movement.reference ?? "—"}</TableCell>
                      <TableCell>{movement.occurredAt.toLocaleDateString()}</TableCell>
                      <TableCell>{line.product.name}</TableCell>
                      <TableCell>{line.product.sku}</TableCell>
                      <TableCell>{line.warehouse.name}</TableCell>
                      <TableCell>{line.warehouse.code}</TableCell>
                      <TableCell>{line.quantityDelta}</TableCell>
                    </TableRow>
                  ))
            )
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <a
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search, currentType, currentStatus, currentProductId, currentWarehouseId, currentFrom, currentTo)}
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
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search, currentType, currentStatus, currentProductId, currentWarehouseId, currentFrom, currentTo)}
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

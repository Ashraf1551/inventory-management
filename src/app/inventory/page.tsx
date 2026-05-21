import Link from "next/link"
import Form from "next/form"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { StockAdjustmentForm } from "@/features/inventory/components/stock-adjustment-form"
import { StockTransferForm } from "@/features/inventory/components/stock-transfer-form"
import { listActiveProducts } from "@/features/products/queries/list-active-products.query"
import { listActiveWarehouses } from "@/features/warehouses/queries/list-active-warehouses.query"
import { listInventoryBalances } from "@/features/inventory/queries/list-inventory-balances.query"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; productId?: string; warehouseId?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string, productId?: string, warehouseId?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  if (productId) params.set("productId", productId)
  if (warehouseId) params.set("warehouseId", warehouseId)
  return `${base}?${params.toString()}`
}

export default async function InventoryPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const productId = params.productId || undefined
  const warehouseId = params.warehouseId || undefined
  const result = await listInventoryBalances({
    search,
    productId,
    warehouseId,
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const [products, warehouses] = await Promise.all([
    listActiveProducts(),
    listActiveWarehouses(),
  ])
  const baseUrl = "/inventory"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Balances</h1>

      <Form action="/inventory" className="flex gap-2 mb-4">
        <input type="hidden" name="productId" value={productId ?? ""} />
        <input type="hidden" name="warehouseId" value={warehouseId ?? ""} />
        <Input
          name="search"
          placeholder="Search by SKU, product name, warehouse code, or warehouse name..."
          defaultValue={search}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </Form>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <form action="/inventory" className="flex items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="warehouseId" value={warehouseId ?? ""} />
          <Label htmlFor="product-filter">
            Product
          </Label>
          <Select name="productId" defaultValue={productId ?? ""}>
            <SelectTrigger className="w-full max-w-xs" id="product-filter">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.sku} — {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="xs">
            Filter
          </Button>
        </form>

        <form action="/inventory" className="flex items-center gap-2">
          <input type="hidden" name="search" value={search ?? ""} />
          <input type="hidden" name="productId" value={productId ?? ""} />
          <Label htmlFor="warehouse-filter">
            Warehouse
          </Label>
          <Select name="warehouseId" defaultValue={warehouseId ?? ""}>
            <SelectTrigger className="w-full max-w-xs" id="warehouse-filter">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Warehouses</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={String(w.id)}>
                  {w.code} — {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="xs">
            Filter
          </Button>
        </form>
      </div>

      <StockAdjustmentForm products={products} warehouses={warehouses} />

      <StockTransferForm products={products} warehouses={warehouses} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Warehouse Code</TableHead>
            <TableHead>Qty On Hand</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((balance) => (
            <TableRow key={balance.id}>
              <TableCell>{balance.product.sku}</TableCell>
              <TableCell>{balance.product.name}</TableCell>
              <TableCell>{balance.warehouse.name}</TableCell>
              <TableCell>{balance.warehouse.code}</TableCell>
              <TableCell>{balance.quantityOnHand}</TableCell>
              <TableCell>{balance.updatedAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No inventory balances found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <Link
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search, productId, warehouseId)}
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
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search, productId, warehouseId)}
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

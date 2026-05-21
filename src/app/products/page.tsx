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
import { listProducts } from "@/features/products/queries/list-products.query"
import { listActiveProductCategories } from "@/features/product-categories/queries/list-active-product-categories.query"
import { CreateProductForm } from "@/features/products/components/create-product-form"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; categoryId?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string, status?: string, categoryId?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  if (status) params.set("status", status)
  if (categoryId) params.set("categoryId", categoryId)
  return `${base}?${params.toString()}`
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const status = params.status || undefined
  const categoryId = params.categoryId || undefined

  const result = await listProducts({
    search,
    status: (status as "all" | "active" | "inactive" | undefined),
    categoryId,
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const categoryOptions = await listActiveProductCategories()
  const baseUrl = "/products"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <CreateProductForm categories={categoryOptions} />

      <div className="mb-4 space-y-3">
        <Form action="/products" className="flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
          <Input
            name="search"
            type="search"
            defaultValue={search ?? ""}
            placeholder="Search by SKU or name..."
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </Form>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <form action="/products" className="flex gap-1">
            <input type="hidden" name="search" value={search ?? ""} />
            <input type="hidden" name="categoryId" value={categoryId ?? ""} />
            <Button type="submit" name="status" value="all" variant={!status || status === "all" ? "default" : "outline"} size="xs">All</Button>
            <Button type="submit" name="status" value="active" variant={status === "active" ? "default" : "outline"} size="xs">Active</Button>
            <Button type="submit" name="status" value="inactive" variant={status === "inactive" ? "default" : "outline"} size="xs">Inactive</Button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <form action="/products" className="flex gap-1 flex-wrap">
            <input type="hidden" name="search" value={search ?? ""} />
            <input type="hidden" name="status" value={status ?? ""} />
            <Button type="submit" name="categoryId" value="" variant={!categoryId ? "default" : "outline"} size="xs">All</Button>
            <Button type="submit" name="categoryId" value="uncategorized" variant={categoryId === "uncategorized" ? "default" : "outline"} size="xs">Uncategorized</Button>
            {categoryOptions.map((cat) => (
              <Button key={cat.id} type="submit" name="categoryId" value={String(cat.id)} variant={categoryId === String(cat.id) ? "default" : "outline"} size="xs">{cat.name}</Button>
            ))}
          </form>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Low Stock</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.sku}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>{product.description ?? "—"}</TableCell>
              <TableCell>{product.category?.name ?? "Uncategorized"}</TableCell>
              <TableCell>
                {product.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell>{product.lowStockThreshold != null ? product.lowStockThreshold : "Not set"}</TableCell>
              <TableCell>
                {product.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <a
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search, status, categoryId)}
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
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search, status, categoryId)}
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

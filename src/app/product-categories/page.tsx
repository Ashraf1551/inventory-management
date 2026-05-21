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
import { CreateProductCategoryForm } from "@/features/product-categories/components/create-product-category-form"
import { listProductCategories } from "@/features/product-categories/queries/list-product-categories.query"

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>
}

function paginationHref(base: string, page: number, pageSize: number, search?: string): string {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set("search", search)
  return `${base}?${params.toString()}`
}

export default async function ProductCategoriesPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || undefined
  const result = await listProductCategories({
    search,
    page: params.page ? Number(params.page) : undefined,
    pageSize: params.pageSize ? Number(params.pageSize) : undefined,
  })

  const { rows, pagination } = result
  const baseUrl = "/product-categories"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>

      <CreateProductCategoryForm />

      <Form action="/product-categories" className="flex items-center gap-2 mb-4">
        <Input
          name="search"
          type="search"
          defaultValue={search ?? ""}
          placeholder="Search by name..."
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Link href={`/product-categories/${category.id}`} className="hover:underline">
                  {category.name}
                </Link>
              </TableCell>
              <TableCell>{category.description ?? "—"}</TableCell>
              <TableCell>
                {category.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell>
                {category.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-4">
        {pagination.page > 1 ? (
          <a
            href={paginationHref(baseUrl, pagination.page - 1, pagination.pageSize, search)}
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
            href={paginationHref(baseUrl, pagination.page + 1, pagination.pageSize, search)}
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

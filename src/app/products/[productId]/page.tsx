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
import { getProduct } from "@/features/products/queries/get-product.query"
import { listActiveProductCategories } from "@/features/product-categories/queries/list-active-product-categories.query"
import { UpdateProductForm } from "@/features/products/components/update-product-form"
import { DeactivateProductButton } from "@/features/products/components/deactivate-product-button"
import { ReactivateProductButton } from "@/features/products/components/reactivate-product-button"

type Props = {
  params: Promise<{ productId: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params
  const product = await getProduct(Number(productId))

  if (!product) notFound()

  const activeCategories = await listActiveProductCategories()

  const categoryOptions = product.category
    ? activeCategories.some((c) => c.id === product.category!.id)
      ? activeCategories
      : [...activeCategories, { id: product.category.id, name: product.category.name }]
    : activeCategories

  return (
    <div className="p-6">
      <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
        &larr; Back to Products
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold w-32">SKU</TableCell>
                    <TableCell>{product.sku}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell>{product.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Description</TableCell>
                    <TableCell>{product.description ?? "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Category</TableCell>
                    <TableCell>{product.category?.name ?? "Uncategorized"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell>
                      {product.isActive ? "Active" : "Inactive"}
                      <div className="mt-2">
                        {product.isActive ? (
                          <DeactivateProductButton
                            productId={product.id}
                            productName={product.name}
                          />
                        ) : (
                          <ReactivateProductButton
                            productId={product.id}
                            productName={product.name}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Low Stock Threshold</TableCell>
                    <TableCell>{product.lowStockThreshold != null ? product.lowStockThreshold : "Not set"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Created</TableCell>
                    <TableCell>{product.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Updated</TableCell>
                    <TableCell>{product.updatedAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <UpdateProductForm product={product} categories={categoryOptions} />
        </div>
      </div>
    </div>
  )
}

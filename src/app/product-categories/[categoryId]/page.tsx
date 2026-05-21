import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { getProductCategory } from "@/features/product-categories/queries/get-product-category.query"
import { UpdateProductCategoryForm } from "@/features/product-categories/components/update-product-category-form"
import { DeactivateProductCategoryButton } from "@/features/product-categories/components/deactivate-product-category-button"
import { ReactivateProductCategoryButton } from "@/features/product-categories/components/reactivate-product-category-button"

type Props = {
  params: Promise<{ categoryId: string }>
}

export default async function ProductCategoryDetailPage({ params }: Props) {
  const { categoryId } = await params
  const category = await getProductCategory(Number(categoryId))

  if (!category) notFound()

  return (
    <div className="p-6">
      <Link href="/product-categories" className={cn(buttonVariants({ variant: "link" }), "px-0")}>
        &larr; Back to Categories
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold w-32">Name</TableCell>
                    <TableCell>{category.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Description</TableCell>
                    <TableCell>{category.description ?? "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell>
                      {category.isActive ? "Active" : "Inactive"}
                      {category.isActive ? (
                        <div className="mt-2">
                          <DeactivateProductCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        </div>
                      ) : (
                        <div className="mt-2">
                          <ReactivateProductCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Created</TableCell>
                    <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Updated</TableCell>
                    <TableCell>{category.updatedAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <UpdateProductCategoryForm category={category} />
        </div>
      </div>
    </div>
  )
}

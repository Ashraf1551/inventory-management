import Link from "next/link"
import { notFound } from "next/navigation"
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
      <Link href="/product-categories" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to Categories
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">{category.name}</h1>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <dt className="font-semibold">Name</dt>
            <dd>{category.name}</dd>

            <dt className="font-semibold">Description</dt>
            <dd>{category.description ?? "—"}</dd>

            <dt className="font-semibold">Status</dt>
            <dd>
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
            </dd>

            <dt className="font-semibold">Created</dt>
            <dd>{category.createdAt.toLocaleDateString()}</dd>

            <dt className="font-semibold">Updated</dt>
            <dd>{category.updatedAt.toLocaleDateString()}</dd>
          </dl>
        </div>

        <div>
          <UpdateProductCategoryForm category={category} />
        </div>
      </div>
    </div>
  )
}

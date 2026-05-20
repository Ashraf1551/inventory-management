import Link from "next/link"
import { notFound } from "next/navigation"
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
      <Link href="/products" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to Products
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">{product.name}</h1>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <dt className="font-semibold">SKU</dt>
            <dd>{product.sku}</dd>

            <dt className="font-semibold">Name</dt>
            <dd>{product.name}</dd>

            <dt className="font-semibold">Description</dt>
            <dd>{product.description ?? "—"}</dd>

            <dt className="font-semibold">Category</dt>
            <dd>{product.category?.name ?? "Uncategorized"}</dd>

            <dt className="font-semibold">Status</dt>
            <dd>
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
            </dd>

            <dt className="font-semibold">Created</dt>
            <dd>{product.createdAt.toLocaleDateString()}</dd>

            <dt className="font-semibold">Updated</dt>
            <dd>{product.updatedAt.toLocaleDateString()}</dd>
          </dl>
        </div>

        <div>
          <UpdateProductForm product={product} categories={categoryOptions} />
        </div>
      </div>
    </div>
  )
}

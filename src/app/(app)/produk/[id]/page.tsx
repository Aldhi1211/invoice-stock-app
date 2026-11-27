import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { deleteProduct, updateProduct } from "@/actions/products";
import { DeleteButton } from "@/components/form";
import { ProductForm } from "@/components/product-form";
import { Card, PageHeader } from "@/components/ui";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";
import { isUuid } from "@/lib/uuid";

export const metadata = { title: "Ubah produk" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { shop } = await requireShop();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const product = await db().query.products.findFirst({
    where: and(eq(schema.products.id, id), eq(schema.products.shopId, shop.id)),
  });
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.name} back="/produk" />
      <Card>
        <ProductForm action={updateProduct.bind(null, product.id)} product={product} />
      </Card>
      <div className="mt-6">
        <DeleteButton action={deleteProduct.bind(null, product.id)} label="Hapus produk" />
      </div>
    </>
  );
}

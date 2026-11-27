import { createProduct } from "@/actions/products";
import { ProductForm } from "@/components/product-form";
import { Card, PageHeader } from "@/components/ui";

export const metadata = { title: "Produk baru" };

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Produk baru" back="/produk" />
      <Card>
        <ProductForm action={createProduct} />
      </Card>
    </>
  );
}

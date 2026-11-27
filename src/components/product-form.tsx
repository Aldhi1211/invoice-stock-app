import { ActionForm, Field, SubmitButton } from "@/components/form";
import type { Product } from "@/db/schema";
import type { FormState } from "@/lib/validation";
import { formatNumber } from "@/lib/format";

export function ProductForm({
  action,
  product,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  product?: Product;
}) {
  return (
    <ActionForm action={action}>
      <Field label="Nama produk" name="name" defaultValue={product?.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SKU / kode (opsional)" name="sku" defaultValue={product?.sku ?? ""} />
        <Field label="Satuan" name="unit" defaultValue={product?.unit ?? "pcs"} hint="Contoh: pcs, kg, box" />
      </div>
      <Field
        label="Harga jual (Rp)"
        name="price"
        inputMode="numeric"
        defaultValue={product ? formatNumber(product.price) : ""}
        placeholder="15.000"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Stok saat ini" name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} />
        <Field
          label="Batas stok menipis"
          name="lowStockThreshold"
          type="number"
          min={0}
          defaultValue={product?.lowStockThreshold ?? 5}
          hint="Muncul peringatan jika stok ≤ angka ini"
        />
      </div>
      <SubmitButton>{product ? "Simpan perubahan" : "Tambah produk"}</SubmitButton>
    </ActionForm>
  );
}

import { updateShop } from "@/actions/shop";
import { ActionForm, Field, SubmitButton } from "@/components/form";
import { Card, PageHeader } from "@/components/ui";
import { requireShop } from "@/lib/session";

export const metadata = { title: "Profil toko" };

export default async function SettingsPage() {
  const { shop } = await requireShop();
  return (
    <>
      <PageHeader title="Profil toko" />
      <Card>
        <ActionForm action={updateShop}>
          <h2 className="font-semibold">Identitas toko</h2>
          <Field label="Nama toko" name="name" defaultValue={shop.name} required />
          <Field label="No. WhatsApp toko" name="phone" type="tel" defaultValue={shop.phone ?? ""} />
          <Field label="Alamat" name="address" textarea defaultValue={shop.address ?? ""} />
          <Field label="URL logo (opsional)" name="logoUrl" type="url" defaultValue={shop.logoUrl ?? ""} placeholder="https://…" />

          <h2 className="pt-4 font-semibold">Rekening pembayaran</h2>
          <p className="-mt-2 text-sm text-slate-500">Ditampilkan di invoice supaya pelanggan tahu ke mana harus transfer.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Bank / e-wallet" name="bankName" defaultValue={shop.bankName ?? ""} placeholder="BCA" />
            <Field label="No. rekening" name="bankAccountNumber" defaultValue={shop.bankAccountNumber ?? ""} />
            <Field label="Atas nama" name="bankAccountName" defaultValue={shop.bankAccountName ?? ""} />
          </div>

          <h2 className="pt-4 font-semibold">Invoice</h2>
          <Field label="Awalan nomor invoice" name="invoicePrefix" defaultValue={shop.invoicePrefix} hint="Contoh: INV → INV-2026-0001" />
          <Field label="Catatan di bawah invoice" name="invoiceNotes" textarea defaultValue={shop.invoiceNotes ?? ""} placeholder="Terima kasih sudah berbelanja!" />
          <SubmitButton>Simpan</SubmitButton>
        </ActionForm>
      </Card>
    </>
  );
}

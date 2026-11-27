import { ActionForm, Field, SubmitButton } from "@/components/form";
import type { Customer } from "@/db/schema";
import type { FormState } from "@/lib/validation";

export function CustomerForm({
  action,
  customer,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  customer?: Customer;
}) {
  return (
    <ActionForm action={action}>
      <Field label="Nama" name="name" defaultValue={customer?.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="No. WhatsApp" name="phone" type="tel" inputMode="tel" defaultValue={customer?.phone ?? ""} placeholder="0812…" />
        <Field label="Email (opsional)" name="email" type="email" defaultValue={customer?.email ?? ""} />
      </div>
      <Field label="Alamat" name="address" textarea defaultValue={customer?.address ?? ""} />
      <Field label="Catatan" name="notes" textarea defaultValue={customer?.notes ?? ""} />
      <SubmitButton>{customer ? "Simpan perubahan" : "Tambah pelanggan"}</SubmitButton>
    </ActionForm>
  );
}

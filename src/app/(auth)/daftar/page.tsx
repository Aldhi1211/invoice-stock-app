import Link from "next/link";
import { register } from "@/actions/auth";
import { ActionForm, Field, SubmitButton } from "@/components/form";

export const metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Buat akun toko</h1>
      <ActionForm action={register}>
        <Field label="Nama Anda" name="name" autoComplete="name" required />
        <Field label="Nama toko" name="shopName" placeholder="Contoh: Toko Berkah Jaya" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="new-password" hint="Minimal 8 karakter" required />
        <SubmitButton pendingText="Membuat akun…">Daftar</SubmitButton>
      </ActionForm>
      <p className="mt-4 text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-emerald-700 hover:underline">
          Masuk
        </Link>
      </p>
    </>
  );
}

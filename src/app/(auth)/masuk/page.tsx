import Link from "next/link";
import { login } from "@/actions/auth";
import { ActionForm, Field, SubmitButton } from "@/components/form";

export const metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Masuk</h1>
      <ActionForm action={login}>
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <SubmitButton pendingText="Memproses…">Masuk</SubmitButton>
      </ActionForm>
      <p className="mt-4 text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-emerald-700 hover:underline">
          Daftar gratis
        </Link>
      </p>
    </>
  );
}

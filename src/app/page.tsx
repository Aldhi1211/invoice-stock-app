import Link from "next/link";
import { Logo } from "@/components/logo";

const features = [
  { title: "Invoice rapi dalam 1 menit", body: "Pilih produk, isi jumlah, kirim ke pelanggan lewat WhatsApp atau PDF." },
  { title: "Stok berkurang otomatis", body: "Setiap penjualan langsung memotong stok, jadi tidak perlu catat dua kali." },
  { title: "Peringatan stok menipis", body: "Tahu barang mana yang harus segera di-restock sebelum kehabisan." },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/masuk" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
            Masuk
          </Link>
          <Link href="/daftar" className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700">
            Daftar gratis
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10">
        <section className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Invoice & stok toko Anda, beres dari HP.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            NotaStok membantu UMKM dan toko online kecil membuat invoice, menagih pelanggan, dan memantau stok
            tanpa ribet spreadsheet.
          </p>
          <Link
            href="/daftar"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Mulai gratis
          </Link>
        </section>
        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

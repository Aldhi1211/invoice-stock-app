import Link from "next/link";
import { and, asc, count, eq, lte } from "drizzle-orm";
import { Card, PageHeader } from "@/components/ui";
import { db, schema } from "@/db";
import { formatNumber } from "@/lib/format";
import { requireShop } from "@/lib/session";

export const metadata = { title: "Beranda" };

export default async function DashboardPage() {
  const { shop, user } = await requireShop();
  const p = schema.products;
  const lowStockWhere = and(eq(p.shopId, shop.id), eq(p.isActive, true), lte(p.stock, p.lowStockThreshold));

  const [[productCount], [customerCount], lowStock] = await Promise.all([
    db().select({ n: count() }).from(p).where(eq(p.shopId, shop.id)),
    db().select({ n: count() }).from(schema.customers).where(eq(schema.customers.shopId, shop.id)),
    db().select().from(p).where(lowStockWhere).orderBy(asc(p.stock)).limit(10),
  ]);

  return (
    <>
      <PageHeader title={`Halo, ${user.name ?? "Kak"} 👋`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Produk" value={productCount.n} href="/produk" />
        <Stat label="Pelanggan" value={customerCount.n} href="/pelanggan" />
        <Stat label="Stok menipis" value={lowStock.length} href="/produk?filter=menipis" warn={lowStock.length > 0} />
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold">Stok menipis</h2>
        {lowStock.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Semua stok aman.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {lowStock.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/produk/${item.id}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
                <span className={item.stock === 0 ? "font-semibold text-red-600" : "text-amber-600"}>
                  {formatNumber(item.stock)} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {productCount.n === 0 && (
        <Card className="mt-6 bg-emerald-50">
          <h2 className="font-semibold text-emerald-900">Mulai dari sini</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-emerald-900">
            <li>
              Lengkapi <Link href="/pengaturan" className="underline">profil toko</Link> (alamat & rekening untuk invoice).
            </li>
            <li>
              Tambahkan <Link href="/produk/baru" className="underline">produk pertama</Link> beserta stoknya.
            </li>
            <li>
              Catat <Link href="/pelanggan/baru" className="underline">pelanggan</Link> langganan Anda.
            </li>
          </ol>
        </Card>
      )}
    </>
  );
}

function Stat({ label, value, href, warn }: { label: string; value: number; href: string; warn?: boolean }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-300">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${warn ? "text-amber-600" : ""}`}>{formatNumber(value)}</p>
    </Link>
  );
}

import Link from "next/link";
import { and, asc, eq, ilike, lte, or, type SQL } from "drizzle-orm";
import { EmptyState, PageHeader, SearchBox } from "@/components/ui";
import { db, schema } from "@/db";
import { formatNumber, formatRupiah } from "@/lib/format";
import { requireShop } from "@/lib/session";

export const metadata = { title: "Produk" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { shop } = await requireShop();
  const { q, filter } = await searchParams;
  const p = schema.products;
  const conditions: (SQL | undefined)[] = [eq(p.shopId, shop.id)];
  if (q) conditions.push(or(ilike(p.name, `%${q}%`), ilike(p.sku, `%${q}%`)));
  if (filter === "menipis") conditions.push(lte(p.stock, p.lowStockThreshold));
  const items = await db().select().from(p).where(and(...conditions)).orderBy(asc(p.name)).limit(200);

  return (
    <>
      <PageHeader title="Produk" action={{ href: "/produk/baru", label: "+ Produk" }} />
      <SearchBox placeholder="Cari nama atau SKU…" defaultValue={q} />
      {filter === "menipis" && (
        <p className="mb-3 text-sm text-slate-600">
          Menampilkan stok menipis.{" "}
          <Link href="/produk" className="text-emerald-700 hover:underline">
            Tampilkan semua
          </Link>
        </p>
      )}
      {items.length === 0 ? (
        <EmptyState
          title={q || filter ? "Tidak ada produk yang cocok" : "Belum ada produk"}
          body={q || filter ? "Coba kata kunci lain." : "Tambahkan produk agar bisa dipakai di invoice."}
          action={q || filter ? undefined : { href: "/produk/baru", label: "Tambah produk pertama" }}
        />
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.map((item) => {
            const low = item.stock <= item.lowStockThreshold;
            return (
              <li key={item.id}>
                <Link href={`/produk/${item.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.sku ? `${item.sku} · ` : ""}
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.stock === 0 ? "bg-red-50 text-red-700" : low ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {formatNumber(item.stock)} {item.unit}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

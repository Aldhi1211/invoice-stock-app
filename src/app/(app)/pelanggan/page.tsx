import Link from "next/link";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { EmptyState, PageHeader, SearchBox } from "@/components/ui";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";

export const metadata = { title: "Pelanggan" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { shop } = await requireShop();
  const { q } = await searchParams;
  const c = schema.customers;
  const items = await db()
    .select()
    .from(c)
    .where(and(eq(c.shopId, shop.id), q ? or(ilike(c.name, `%${q}%`), ilike(c.phone, `%${q}%`)) : undefined))
    .orderBy(asc(c.name))
    .limit(200);

  return (
    <>
      <PageHeader title="Pelanggan" action={{ href: "/pelanggan/baru", label: "+ Pelanggan" }} />
      <SearchBox placeholder="Cari nama atau nomor HP…" defaultValue={q} />
      {items.length === 0 ? (
        <EmptyState
          title={q ? "Tidak ada pelanggan yang cocok" : "Belum ada pelanggan"}
          body={q ? "Coba kata kunci lain." : "Simpan data pelanggan supaya invoice lebih cepat dibuat."}
          action={q ? undefined : { href: "/pelanggan/baru", label: "Tambah pelanggan pertama" }}
        />
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/pelanggan/${item.id}`} className="block px-4 py-3 hover:bg-slate-50">
                <p className="font-medium">{item.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {[item.phone, item.address].filter(Boolean).join(" · ") || "—"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

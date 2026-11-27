import { logout } from "@/actions/auth";
import { Logo } from "@/components/logo";
import { BottomNav, SideNav } from "@/components/nav";
import { requireShop } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { shop, user } = await requireShop();
  return (
    <div className="min-h-dvh md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <Logo href="/dashboard" />
        <p className="mt-1 truncate text-xs text-slate-500">{shop.name}</p>
        <div className="mt-6 flex-1">
          <SideNav />
        </div>
        <div className="border-t border-slate-200 pt-3 text-sm">
          <p className="truncate text-slate-600">{user.email}</p>
          <form action={logout}>
            <button className="mt-1 text-slate-500 hover:text-red-600">Keluar</button>
          </form>
        </div>
      </aside>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Logo href="/dashboard" />
        <form action={logout}>
          <button className="text-sm text-slate-500">Keluar</button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 md:pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}

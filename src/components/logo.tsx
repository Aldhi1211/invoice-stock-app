import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-bold text-slate-900">
      <span className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-sm text-white">N</span>
      <span className="text-lg">NotaStok</span>
    </Link>
  );
}

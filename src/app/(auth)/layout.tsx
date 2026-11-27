import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Logo />
      <div className="mt-6 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

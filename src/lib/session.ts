import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";

/** Mengambil toko milik pengguna yang sedang login, atau redirect ke halaman masuk. */
export const requireShop = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/masuk");
  const shop = await db().query.shops.findFirst({
    where: eq(schema.shops.ownerId, userId),
  });
  if (!shop) redirect("/masuk");
  return { user: session.user, shop };
});

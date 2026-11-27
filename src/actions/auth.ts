"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { db, schema } from "@/db";
import { formToObject, type FormState } from "@/lib/validation";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 huruf"),
  shopName: z.string().trim().min(2, "Nama toko minimal 2 huruf"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const { name, shopName, email, password } = parsed.data;

  const existing = await db().query.users.findFirst({ where: eq(schema.users.email, email) });
  if (existing) return { fieldErrors: { email: ["Email ini sudah terdaftar. Silakan masuk."] } };

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db()
    .insert(schema.users)
    .values({ name, email, passwordHash })
    .returning({ id: schema.users.id });
  try {
    await db().insert(schema.shops).values({ ownerId: user.id, name: shopName });
  } catch (e) {
    await db().delete(schema.users).where(eq(schema.users.id, user.id));
    throw e;
  }

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "Email atau password salah." };
    throw e;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

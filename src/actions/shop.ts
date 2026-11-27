"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";
import { formToObject, optionalText, type FormState } from "@/lib/validation";

const shopSchema = z.object({
  name: z.string().trim().min(2, "Nama toko minimal 2 huruf"),
  phone: optionalText,
  address: optionalText,
  logoUrl: optionalText.pipe(z.string().url("URL logo tidak valid").nullable()),
  bankName: optionalText,
  bankAccountNumber: optionalText,
  bankAccountName: optionalText,
  invoicePrefix: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{1,10}$/, "Gunakan 1–10 huruf/angka, misalnya INV"),
  invoiceNotes: optionalText,
});

export async function updateShop(_: FormState, formData: FormData): Promise<FormState> {
  const { shop } = await requireShop();
  const parsed = shopSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  await db().update(schema.shops).set(parsed.data).where(eq(schema.shops.id, shop.id));
  revalidatePath("/", "layout");
  return { success: "Profil toko tersimpan." };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";
import { formToObject, optionalText, type FormState } from "@/lib/validation";

const customerSchema = z.object({
  name: z.string().trim().min(1, "Nama pelanggan wajib diisi"),
  phone: optionalText.pipe(
    z
      .string()
      .regex(/^[+\d][\d\s-]{6,19}$/, "Nomor HP tidak valid")
      .nullable(),
  ),
  email: optionalText.pipe(z.string().email("Format email tidak valid").nullable()),
  address: optionalText,
  notes: optionalText,
});

export async function createCustomer(_: FormState, formData: FormData): Promise<FormState> {
  const { shop } = await requireShop();
  const parsed = customerSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  await db().insert(schema.customers).values({ ...parsed.data, shopId: shop.id });
  revalidatePath("/pelanggan");
  redirect("/pelanggan");
}

export async function updateCustomer(id: string, _: FormState, formData: FormData): Promise<FormState> {
  const { shop } = await requireShop();
  const parsed = customerSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  await db()
    .update(schema.customers)
    .set(parsed.data)
    .where(and(eq(schema.customers.id, id), eq(schema.customers.shopId, shop.id)));
  revalidatePath("/pelanggan");
  redirect("/pelanggan");
}

export async function deleteCustomer(id: string) {
  const { shop } = await requireShop();
  await db()
    .delete(schema.customers)
    .where(and(eq(schema.customers.id, id), eq(schema.customers.shopId, shop.id)));
  revalidatePath("/pelanggan");
  redirect("/pelanggan");
}

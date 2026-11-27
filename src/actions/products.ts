"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";
import { formToObject, intField, optionalText, rupiahField, type FormState } from "@/lib/validation";

const productSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  sku: optionalText,
  unit: z.string().trim().min(1).default("pcs"),
  price: rupiahField,
  stock: intField("Stok"),
  lowStockThreshold: intField("Batas stok menipis"),
});

function isUniqueViolation(e: unknown) {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}

export async function createProduct(_: FormState, formData: FormData): Promise<FormState> {
  const { shop } = await requireShop();
  const parsed = productSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await db().insert(schema.products).values({ ...parsed.data, shopId: shop.id });
  } catch (e) {
    if (isUniqueViolation(e)) return { fieldErrors: { sku: ["SKU ini sudah dipakai produk lain"] } };
    throw e;
  }
  revalidatePath("/produk");
  redirect("/produk");
}

export async function updateProduct(id: string, _: FormState, formData: FormData): Promise<FormState> {
  const { shop } = await requireShop();
  const parsed = productSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await db()
      .update(schema.products)
      .set(parsed.data)
      .where(and(eq(schema.products.id, id), eq(schema.products.shopId, shop.id)));
  } catch (e) {
    if (isUniqueViolation(e)) return { fieldErrors: { sku: ["SKU ini sudah dipakai produk lain"] } };
    throw e;
  }
  revalidatePath("/produk");
  redirect("/produk");
}

export async function deleteProduct(id: string) {
  const { shop } = await requireShop();
  await db()
    .delete(schema.products)
    .where(and(eq(schema.products.id, id), eq(schema.products.shopId, shop.id)));
  revalidatePath("/produk");
  redirect("/produk");
}

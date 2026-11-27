import { z } from "zod";
import { parseRupiah } from "./format";

/** String kosong menjadi null; selain itu di-trim. */
export const optionalText = z
  .string()
  .optional()
  .transform((v) => {
    const t = v?.trim();
    return t ? t : null;
  });

export const rupiahField = z
  .string()
  .default("0")
  .transform(parseRupiah)
  .pipe(z.number().int().min(0, "Harga tidak boleh negatif").max(2_000_000_000, "Harga terlalu besar"));

export const intField = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} harus berupa angka` })
    .int(`${label} harus bilangan bulat`)
    .min(0, `${label} tidak boleh negatif`)
    .max(1_000_000_000, `${label} terlalu besar`);

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: string;
};

export function formToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") obj[key] = value;
  }
  return obj;
}

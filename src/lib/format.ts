const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

/** Mengubah input seperti "Rp 15.000" atau "15000" menjadi 15000. */
export function parseRupiah(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

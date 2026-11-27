# NotaStok

Aplikasi web invoice & stok sederhana untuk UMKM dan toko online kecil.
Setiap toko daftar sendiri dan hanya melihat datanya sendiri.

**Teknologi:** Next.js 15 (App Router) · Neon Postgres · Drizzle ORM · Auth.js · Tailwind CSS

## Fitur saat ini (Langkah 1: Fondasi)

- Daftar & masuk dengan email + password (satu akun = satu toko)
- Profil toko: nama, alamat, WhatsApp, logo, rekening bank, awalan nomor invoice
- Produk: harga (Rupiah), SKU, satuan, stok, batas stok menipis, pencarian
- Pelanggan: nama, WhatsApp, alamat, catatan, pencarian
- Beranda: ringkasan jumlah produk/pelanggan dan daftar stok menipis
- Tampilan ramah HP (navigasi bawah) dan desktop (sidebar)

## Menjalankan di komputer

1. Buat database di [Neon](https://neon.tech) lalu salin *connection string*-nya.
2. Siapkan environment:
   ```bash
   cp .env.example .env.local
   # isi DATABASE_URL dengan connection string Neon
   # isi AUTH_SECRET dengan hasil: npx auth secret   (atau: openssl rand -base64 32)
   ```
3. Install dan buat tabel:
   ```bash
   npm install
   npm run db:migrate
   ```
4. Jalankan: `npm run dev`, lalu buka http://localhost:3000

> Untuk development tanpa Neon, `DATABASE_URL` juga boleh mengarah ke Postgres lokal
> (`postgres://user:pass@localhost:5432/db`). Aplikasi otomatis memakai driver biasa untuk `localhost`
> dan driver serverless Neon untuk alamat lain.

## Deploy ke Vercel

1. Import repo ini di Vercel.
2. Tambahkan environment variable `DATABASE_URL` dan `AUTH_SECRET`.
3. Jalankan `npm run db:migrate` sekali dari komputer Anda (dengan `DATABASE_URL` produksi) untuk membuat tabel.

## Mengubah struktur database

Ubah `src/db/schema.ts`, lalu:
```bash
npm run db:generate   # membuat file migrasi baru di ./drizzle
npm run db:migrate    # menerapkannya ke database
```

## Rencana berikutnya

2. Invoice: buat invoice, stok berkurang otomatis, status bayar, PDF/cetak, kirim via WhatsApp
3. Stok & laporan: restock, riwayat stok, omzet, produk terlaris, piutang
4. Siap dijual: landing page, paket Gratis/Pro, deploy ke domain

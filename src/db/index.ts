import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * Koneksi database.
 * - Produksi / Neon: memakai driver HTTP Neon (cocok untuk serverless/Vercel).
 * - Postgres lokal (localhost): memakai node-postgres, untuk development tanpa Neon.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diisi. Lihat .env.example.");
  const host = new URL(url).hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return drizzlePg(url, { schema }) as unknown as ReturnType<typeof drizzleNeon<typeof schema>>;
  }
  return drizzleNeon(neon(url), { schema });
}

type Db = ReturnType<typeof createDb>;
let _db: Db | undefined;

export function db(): Db {
  if (!_db) _db = createDb();
  return _db;
}

export { schema };

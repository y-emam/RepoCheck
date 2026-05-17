// One-off migration runner. Applies supabase/schema.sql to DATABASE_URL.
// Usage: node --env-file=.env.local scripts/migrate.mjs
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(here, "..", "supabase", "schema.sql");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = await readFile(sqlPath, "utf8");
const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query(sql);
  console.log("Schema applied successfully");
} catch (err) {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await client.end();
}

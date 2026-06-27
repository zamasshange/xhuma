#!/usr/bin/env node
/**
 * Applies supabase/migrations/007_schema_cache_fix.sql using DATABASE_URL from .env.local
 * Usage: pnpm db:sync
 */
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const envPath = resolve(root, ".env.local")

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  if (!existsSync(envPath)) {
    console.error("Missing DATABASE_URL. Set it in .env.local or the environment.")
    process.exit(1)
  }
  const text = readFileSync(envPath, "utf8")
  for (const line of text.split("\n")) {
    const m = line.match(/^DATABASE_URL=(.+)$/)
    if (m) return m[1].trim().replace(/^["']|["']$/g, "")
  }
  console.error("DATABASE_URL not found in .env.local")
  process.exit(1)
}

const sqlPath = resolve(root, "supabase/migrations/007_schema_cache_fix.sql")
const sql = readFileSync(sqlPath, "utf8")

const client = new pg.Client({ connectionString: loadDatabaseUrl(), ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  console.log("Applying schema sync…")
  await client.query(sql)
  console.log("Done. profiles.template_id and links.icon are ready; PostgREST cache reloaded.")
} catch (err) {
  console.error("Schema sync failed:", err.message)
  process.exit(1)
} finally {
  await client.end()
}

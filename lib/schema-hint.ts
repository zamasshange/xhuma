const SCHEMA_FIX =
  "Run `pnpm db:sync` locally or paste supabase/migrations/007_schema_cache_fix.sql in Supabase → SQL Editor."

/** True when PostgREST / Postgres reports a column that is not in the table or schema cache. */
export function isMissingColumnError(message: string, column: string, table?: string): boolean {
  if (/schema cache/i.test(message) && message.includes(`'${column}'`)) return true
  if (new RegExp(`could not find the '${column}' column`, "i").test(message)) return true
  if (table && new RegExp(`could not find the '${column}' column of '${table}'`, "i").test(message)) {
    return true
  }
  // Postgres: column links.icon does not exist
  if (table && new RegExp(`column ${table}\\.${column} does not exist`, "i").test(message)) return true
  if (new RegExp(`column "?[a-z_]+"?\\.${column} does not exist`, "i").test(message)) return true
  return false
}

export function withSchemaHint(message: string): string {
  if (/schema cache|could not find the .* column|column .* does not exist/i.test(message)) {
    return `${message} — ${SCHEMA_FIX}`
  }
  return message
}

export function omitColumn<T extends Record<string, unknown>>(row: T, column: keyof T): T {
  const next = { ...row }
  delete next[column]
  return next
}

const SCHEMA_FIX =
  "Run `pnpm db:sync` locally or paste supabase/migrations/007_schema_cache_fix.sql in Supabase → SQL Editor."

export function isMissingColumnError(message: string, column: string, table?: string): boolean {
  if (/schema cache/i.test(message) && message.includes(`'${column}'`)) return true
  if (table) {
    return new RegExp(`could not find the '${column}' column of '${table}'`, "i").test(message)
  }
  return new RegExp(`could not find the '${column}' column`, "i").test(message)
}

export function withSchemaHint(message: string): string {
  if (/schema cache|could not find the .* column/i.test(message)) {
    return `${message} — ${SCHEMA_FIX}`
  }
  return message
}

export function omitColumn<T extends Record<string, unknown>>(row: T, column: keyof T): T {
  const next = { ...row }
  delete next[column]
  return next
}

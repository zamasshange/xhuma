import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function getUserId(request: Request): string | null {
  return request.headers.get("x-user-id")?.trim() || null
}

export function requireUserId(request: Request): string | { error: string } {
  const id = getUserId(request)
  if (!id) return { error: "Missing user id" }
  return id
}

import { createClient } from "@supabase/supabase-js"
import { getAuthUserId, requireAuthUserId } from "@/lib/auth"

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function getUserId(request: Request): Promise<string | null> {
  return getAuthUserId(request)
}

export async function requireUserId(request: Request): Promise<string | { error: string }> {
  return requireAuthUserId(request)
}

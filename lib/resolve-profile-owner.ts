import type { SupabaseClient } from "@supabase/supabase-js"
import { getAuthUserId } from "@/lib/auth"

type ProfileRow = Record<string, unknown>

/** Resolve the profiles.id that owns this session (Clerk id or legacy anon id). */
export async function findProfileForRequest(
  request: Request,
  supabase: SupabaseClient,
): Promise<{ ownerId: string | null; profile: ProfileRow | null; error?: string }> {
  const authId = await getAuthUserId(request)
  if (!authId) return { ownerId: null, profile: null }

  const { data: direct, error: directErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authId)
    .maybeSingle()

  if (directErr) return { ownerId: null, profile: null, error: directErr.message }
  if (direct) return { ownerId: String(direct.id), profile: direct as ProfileRow }

  const anonId = request.headers.get("x-user-id")?.trim()
  if (anonId && anonId !== authId) {
    const { data: anon, error: anonErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", anonId)
      .maybeSingle()

    if (anonErr) return { ownerId: null, profile: null, error: anonErr.message }
    if (anon) return { ownerId: String(anon.id), profile: anon as ProfileRow }
  }

  return { ownerId: authId, profile: null }
}

export async function requireProfileOwnerId(
  request: Request,
  supabase: SupabaseClient,
): Promise<string | { error: string }> {
  const { ownerId, profile, error } = await findProfileForRequest(request, supabase)
  if (error) return { error }
  if (!ownerId || !profile) return { error: "Profile not found — claim your username first" }
  return ownerId
}

import { createAdminClient, getUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { profileCreateSchema, profileUpdateSchema } from "@/lib/validations"
import { DEFAULT_THEME, themeForRender, mapProfile, type ProfileTheme } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { revalidatePublicProfile } from "@/lib/revalidate-profile"
import { findProfileForRequest, requireProfileOwnerId } from "@/lib/resolve-profile-owner"

export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { profile, error } = await findProfileForRequest(request, supabase)
  if (error) return apiError(error, 500)
  if (!profile) return apiSuccess(null)

  return apiSuccess(mapProfile(profile))
}

export async function POST(request: Request) {
  const userId = await getUserId(request)
  if (!userId) return apiError("Unauthorized", 401)

  const body = await request.json()
  const parsed = profileCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const supabase = createAdminClient()

  const { profile: existing } = await findProfileForRequest(request, supabase)
  if (existing) return apiError("Profile already exists", 409)

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: parsed.data.username.toLowerCase(),
      display_name: parsed.data.display_name,
      bio: parsed.data.bio ?? "",
      theme_json: DEFAULT_THEME,
    })
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }
  if (!data) return apiError("Could not create profile", 500)

  return apiSuccess(mapProfile(data), 201)
}

export async function PATCH(request: Request) {
  const supabase = createAdminClient()
  const ownerId = await requireProfileOwnerId(request, supabase)
  if (typeof ownerId === "object") return apiError(ownerId.error, 404)

  const body = await request.json()
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const updates: Record<string, unknown> = {}
  if (parsed.data.username) updates.username = parsed.data.username.toLowerCase()
  if (parsed.data.display_name) updates.display_name = parsed.data.display_name
  if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio
  if (parsed.data.avatar_url !== undefined) updates.avatar_url = parsed.data.avatar_url
  if (parsed.data.theme) {
    updates.theme_json = themeForRender(resolveThemeBackground(parsed.data.theme as ProfileTheme))
  }

  if (Object.keys(updates).length === 0) {
    return apiError("No changes to save", 400)
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", ownerId)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }
  if (!data) return apiError("Profile not found", 404)

  revalidatePublicProfile(String(data.username))

  return apiSuccess(mapProfile(data))
}

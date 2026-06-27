import { createAdminClient, getUserId, requireUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { profileCreateSchema, profileUpdateSchema } from "@/lib/validations"
import { DEFAULT_THEME, themeForRender, mapProfile, type ProfileTheme } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { revalidatePublicProfile } from "@/lib/revalidate-profile"

export async function GET(request: Request) {
  const userId = await getUserId(request)
  if (!userId) return apiSuccess(null)

  const supabase = createAdminClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
  if (error) return apiError(error.message, 500)
  if (!data) return apiSuccess(null)

  return apiSuccess(mapProfile(data))
}

export async function POST(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const body = await request.json()
  const parsed = profileCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const supabase = createAdminClient()

  const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()
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
    .single()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }

  return apiSuccess(mapProfile(data), 201)
}

export async function PATCH(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

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

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }

  revalidatePublicProfile(String(data.username))

  return apiSuccess(mapProfile(data))
}

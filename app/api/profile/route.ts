import { createClient } from "@/lib/supabase/server"
import { apiSuccess, apiError } from "@/lib/api-response"
import { profileCreateSchema, profileUpdateSchema } from "@/lib/validations"
import { DEFAULT_THEME } from "@/lib/database.types"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (error && error.code !== "PGRST116") return apiError(error.message, 500)
  if (!data) return apiSuccess(null)

  return apiSuccess(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const body = await request.json()
  const parsed = profileCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).single()
  if (existing) return apiError("Profile already exists", 409)

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      username: parsed.data.username.toLowerCase(),
      display_name: parsed.data.display_name,
      bio: parsed.data.bio ?? "",
      theme: DEFAULT_THEME,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }

  return apiSuccess(data, 201)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const body = await request.json()
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const updates: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.username) updates.username = parsed.data.username.toLowerCase()

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return apiError("Username already taken", 409)
    return apiError(error.message, 500)
  }

  return apiSuccess(data)
}

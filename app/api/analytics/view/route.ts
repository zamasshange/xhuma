import { createClient } from "@/lib/supabase/server"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function POST(request: Request) {
  const body = await request.json()
  const username = body.username as string | undefined
  if (!username) return apiError("Username required")

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .single()

  if (!profile) return apiError("Profile not found", 404)

  const { error } = await supabase.from("profile_views").insert({ user_id: profile.id })
  if (error) return apiError(error.message, 500)

  return apiSuccess({ tracked: true })
}

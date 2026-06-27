import { createAdminClient } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function POST(request: Request) {
  const body = await request.json()
  const username = body.username as string | undefined
  if (!username) return apiError("Username required")

  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .maybeSingle()

  if (!profile) return apiError("Profile not found", 404)

  const { error } = await supabase
    .from("analytics")
    .insert({ user_id: profile.id, type: "view" })

  if (error) return apiError(error.message, 500)

  return apiSuccess({ tracked: true })
}

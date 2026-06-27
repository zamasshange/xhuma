import { createAdminClient } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { usernameSchema } from "@/lib/validations"
import { isValidUsername } from "@/lib/username"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")?.toLowerCase().trim() ?? ""

  if (!isValidUsername(username)) {
    return apiSuccess({ available: false, reason: "invalid" })
  }

  const parsed = usernameSchema.safeParse(username)
  if (!parsed.success) {
    return apiSuccess({ available: false, reason: "invalid" })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle()

  return apiSuccess({ available: !data })
}

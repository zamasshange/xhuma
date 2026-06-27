import { createAdminClient, getUserId, requireUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { linkCreateSchema, linkUpdateSchema, linksReorderSchema } from "@/lib/validations"
import { inferLinkIcon } from "@/lib/infer-link-icon"

export async function GET(request: Request) {
  const userId = await getUserId(request)
  if (!userId) return apiSuccess([])

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true })

  if (error) return apiError(error.message, 500)
  return apiSuccess(data ?? [])
}

export async function POST(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const body = await request.json()
  const parsed = linkCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const supabase = createAdminClient()
  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { data, error } = await supabase
    .from("links")
    .insert({
      user_id: userId,
      title: parsed.data.title,
      url: parsed.data.url,
      icon: parsed.data.icon ?? inferLinkIcon(parsed.data.title, parsed.data.url),
      position: count ?? 0,
    })
    .select()
    .single()

  if (error) return apiError(error.message, 500)
  return apiSuccess(data, 201)
}

export async function PATCH(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const body = await request.json()
  const supabase = createAdminClient()

  if (body.links) {
    const parsed = linksReorderSchema.safeParse(body)
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

    for (const link of parsed.data.links) {
      await supabase
        .from("links")
        .update({ position: link.position })
        .eq("id", link.id)
        .eq("user_id", userId)
    }
    return apiSuccess({ reordered: true })
  }

  const parsed = linkUpdateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const { id, ...updates } = parsed.data
  const { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) return apiError(error.message, 500)
  return apiSuccess(data)
}

export async function DELETE(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const id = new URL(request.url).searchParams.get("id")
  if (!id) return apiError("Missing link id")

  const supabase = createAdminClient()
  const { error } = await supabase.from("links").delete().eq("id", id).eq("user_id", userId)
  if (error) return apiError(error.message, 500)

  return apiSuccess({ deleted: true })
}

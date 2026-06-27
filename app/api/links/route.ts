import { createClient } from "@/lib/supabase/server"
import { apiSuccess, apiError } from "@/lib/api-response"
import { linkCreateSchema, linkUpdateSchema, linksReorderSchema } from "@/lib/validations"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true })

  if (error) return apiError(error.message, 500)
  return apiSuccess(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const body = await request.json()
  const parsed = linkCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data, error } = await supabase
    .from("links")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      url: parsed.data.url,
      position: count ?? 0,
    })
    .select()
    .single()

  if (error) return apiError(error.message, 500)
  return apiSuccess(data, 201)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const body = await request.json()

  if (body.links) {
    const parsed = linksReorderSchema.safeParse(body)
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

    for (const link of parsed.data.links) {
      await supabase
        .from("links")
        .update({ position: link.position })
        .eq("id", link.id)
        .eq("user_id", user.id)
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
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) return apiError(error.message, 500)
  return apiSuccess(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const id = new URL(request.url).searchParams.get("id")
  if (!id) return apiError("Missing link id")

  const { error } = await supabase.from("links").delete().eq("id", id).eq("user_id", user.id)
  if (error) return apiError(error.message, 500)

  return apiSuccess({ deleted: true })
}

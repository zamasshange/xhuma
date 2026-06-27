import { createAdminClient } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { linkCreateSchema, linkUpdateSchema, linksReorderSchema } from "@/lib/validations"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import { isMissingColumnError, omitColumn, withSchemaHint } from "@/lib/schema-hint"
import { revalidatePublicProfile } from "@/lib/revalidate-profile"
import { findProfileForRequest, requireProfileOwnerId } from "@/lib/resolve-profile-owner"

const LINK_SELECT = "id, user_id, title, url, position, clicks, is_active, created_at"

async function revalidateProfileForUser(supabase: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle()
  if (data?.username) revalidatePublicProfile(data.username)
}

export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { ownerId, profile } = await findProfileForRequest(request, supabase)
  if (!profile || !ownerId) return apiSuccess([])

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", ownerId)
    .order("position", { ascending: true })

  if (error) return apiError(error.message, 500)
  return apiSuccess(data ?? [])
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const ownerId = await requireProfileOwnerId(request, supabase)
  if (typeof ownerId === "object") return apiError(ownerId.error, 401)

  const body = await request.json()
  const parsed = linkCreateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", ownerId)

  const row = {
    user_id: ownerId,
    title: parsed.data.title,
    url: parsed.data.url,
    icon: parsed.data.icon ?? inferLinkIcon(parsed.data.title, parsed.data.url),
    position: count ?? 0,
  }

  let { data, error } = await supabase.from("links").insert(row).select(LINK_SELECT).maybeSingle()

  if (error && isMissingColumnError(error.message, "icon", "links")) {
    ;({ data, error } = await supabase
      .from("links")
      .insert(omitColumn(row, "icon"))
      .select(LINK_SELECT)
      .maybeSingle())
  }

  if (error) return apiError(withSchemaHint(error.message), 500)
  if (!data) return apiError("Could not create link", 500)

  await revalidateProfileForUser(supabase, ownerId)
  return apiSuccess(data, 201)
}

export async function PATCH(request: Request) {
  const supabase = createAdminClient()
  const ownerId = await requireProfileOwnerId(request, supabase)
  if (typeof ownerId === "object") return apiError(ownerId.error, 401)

  const body = await request.json()

  if (body.links) {
    const parsed = linksReorderSchema.safeParse(body)
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

    for (const link of parsed.data.links) {
      await supabase
        .from("links")
        .update({ position: link.position })
        .eq("id", link.id)
        .eq("user_id", ownerId)
    }
    await revalidateProfileForUser(supabase, ownerId)
    return apiSuccess({ reordered: true })
  }

  const parsed = linkUpdateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid input")

  const { id, ...updates } = parsed.data
  let { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .eq("user_id", ownerId)
    .select(LINK_SELECT)
    .maybeSingle()

  if (error && updates.icon !== undefined && isMissingColumnError(error.message, "icon", "links")) {
    ;({ data, error } = await supabase
      .from("links")
      .update(omitColumn(updates, "icon"))
      .eq("id", id)
      .eq("user_id", ownerId)
      .select(LINK_SELECT)
      .maybeSingle())
  }

  if (error) return apiError(withSchemaHint(error.message), 500)
  if (!data) return apiError("Link not found", 404)

  await revalidateProfileForUser(supabase, ownerId)
  return apiSuccess(data)
}

export async function DELETE(request: Request) {
  const supabase = createAdminClient()
  const ownerId = await requireProfileOwnerId(request, supabase)
  if (typeof ownerId === "object") return apiError(ownerId.error, 401)

  const id = new URL(request.url).searchParams.get("id")
  if (!id) return apiError("Missing link id")

  const { error } = await supabase.from("links").delete().eq("id", id).eq("user_id", ownerId)
  if (error) return apiError(error.message, 500)

  await revalidateProfileForUser(supabase, ownerId)
  return apiSuccess({ deleted: true })
}

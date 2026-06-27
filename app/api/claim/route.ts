import { createAdminClient, requireUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { usernameSchema } from "@/lib/validations"
import { mapProfile, themeForRender } from "@/lib/database.types"
import { normalizeDraftData } from "@/lib/templates-server"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import type { TemplateDocument } from "@/lib/editor-state"
import { isMissingColumnError, omitColumn, withSchemaHint } from "@/lib/schema-hint"

export async function POST(request: Request) {
  const sessionId = await requireUserId(request)
  if (typeof sessionId === "object") return apiError(sessionId.error, 401)

  const body = await request.json()
  const parsed = usernameSchema.safeParse(body.username)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid username", 400)

  const username = parsed.data.toLowerCase()
  const supabase = createAdminClient()

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle()
  if (existingProfile) return apiError("Profile already claimed", 409)

  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle()
  if (taken) return apiError("Username already taken", 409)

  const { data: draft, error: draftErr } = await supabase
    .from("profile_drafts")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle()

  if (draftErr) return apiError(draftErr.message, 500)
  if (!draft) return apiError("No draft found — pick a template first", 404)

  const data = normalizeDraftData(draft.data_json as Record<string, unknown>)

  const profileRow = {
    id: sessionId,
    username,
    display_name: data.profile.display_name || username,
    bio: data.profile.bio ?? "",
    avatar_url: data.profile.avatar_url,
    theme_json: themeForRender({
      ...data.theme,
      page_sections: data.page_sections,
    }),
    template_id: draft.template_id,
  }

  let { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .insert(profileRow)
    .select()
    .single()

  if (profileErr && isMissingColumnError(profileErr.message, "template_id", "profiles")) {
    ;({ data: profile, error: profileErr } = await supabase
      .from("profiles")
      .insert(omitColumn(profileRow, "template_id"))
      .select()
      .single())
  }

  if (profileErr) {
    if (profileErr.code === "23505") return apiError("Username already taken", 409)
    return apiError(withSchemaHint(profileErr.message), 500)
  }

  const activeLinks = data.links.filter((l) => l.is_active)
  if (activeLinks.length > 0) {
    const linkRows = activeLinks.map((l, i) => ({
      user_id: sessionId,
      title: l.title,
      url: l.url,
      icon: l.icon ?? inferLinkIcon(l.title, l.url),
      position: i,
      is_active: true,
    }))

    let { error: linksErr } = await supabase.from("links").insert(linkRows)

    if (linksErr && isMissingColumnError(linksErr.message, "icon", "links")) {
      ;({ error: linksErr } = await supabase.from("links").insert(linkRows.map((r) => omitColumn(r, "icon"))))
    }

    if (linksErr) {
      await supabase.from("profiles").delete().eq("id", sessionId)
      return apiError(withSchemaHint(linksErr.message), 500)
    }
  }

  await supabase.from("profile_drafts").delete().eq("session_id", sessionId)

  return apiSuccess(mapProfile(profile), 201)
}

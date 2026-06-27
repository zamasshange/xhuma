import { createAdminClient, getUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"
import { isKnownTemplateId } from "@/lib/templates/catalog"
import {
  ensureTemplateInDb,
  getTemplate,
  mergeDocument,
  normalizeDraftData,
} from "@/lib/templates-server"
import type { TemplateDocument } from "@/lib/editor-state"
import type { ProfileDraft } from "@/lib/database.types"

function mapDraft(row: Record<string, unknown>): ProfileDraft {
  return {
    session_id: String(row.session_id),
    template_id: String(row.template_id),
    data_json: normalizeDraftData(row.data_json as Record<string, unknown>),
    updated_at: String(row.updated_at),
  }
}

export async function GET(request: Request) {
  const sessionId = await getUserId(request)
  if (!sessionId) return apiSuccess(null)

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("profile_drafts")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle()

    if (error) return apiError(error.message, 500)
    if (!data) return apiSuccess(null)
    return apiSuccess(mapDraft(data))
  } catch {
    return apiSuccess(null)
  }
}

export async function PUT(request: Request) {
  const sessionId = await getUserId(request)
  if (!sessionId) return apiError("Missing session", 401)

  const body = await request.json()
  const templateId = body.template_id as string | undefined
  const dataPatch = body.data as Partial<TemplateDocument> | undefined

  if (templateId && !isKnownTemplateId(templateId)) {
    return apiError("Unknown template", 400)
  }

  try {
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from("profile_drafts")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle()

    let nextData: TemplateDocument
    let nextTemplateId: string

    if (templateId) {
      const template = await getTemplate(templateId)
      if (!template) return apiError("Template not found", 404)
      nextTemplateId = templateId
      const base = template.default_data
      nextData = mergeDocument(base, dataPatch ?? {})
    } else if (existing) {
      nextTemplateId = String(existing.template_id)
      nextData = mergeDocument(
        normalizeDraftData(existing.data_json as Record<string, unknown>),
        dataPatch ?? {},
      )
    } else {
      return apiError("template_id required for new draft", 400)
    }

    await ensureTemplateInDb(nextTemplateId)

    const row = {
      session_id: sessionId,
      template_id: nextTemplateId,
      data_json: nextData,
      updated_at: new Date().toISOString(),
    }

    // Delete-then-insert avoids ON CONFLICT / missing-PK issues on older live DBs
    await supabase.from("profile_drafts").delete().eq("session_id", sessionId)

    const { data, error } = await supabase.from("profile_drafts").insert(row).select().single()

    if (error) {
      const hint =
        /relation.*profile_drafts|does not exist/i.test(error.message)
          ? "Run supabase/migrations/006_xhuma_live_fix.sql in Supabase SQL Editor."
          : undefined
      return apiError(hint ? `${error.message} — ${hint}` : error.message, 500)
    }
    return apiSuccess(mapDraft(data))
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Draft save failed", 500)
  }
}

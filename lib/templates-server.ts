import { createAdminClient } from "@/lib/supabase/admin"
import {
  editorStateFromDocument,
  normalizeTemplateDocument,
  type TemplateDocument,
} from "@/lib/editor-state"
import { getStaticTemplate, STATIC_TEMPLATES, type Template } from "@/data/templates"

export async function fetchTemplatesFromDb(): Promise<Template[] | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("templates").select("*").order("name")
    if (error || !data?.length) return null
    return data.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: String(row.description ?? ""),
      preview_image: row.preview_image != null ? String(row.preview_image) : null,
      default_data: normalizeTemplateDocument(row.default_data as Record<string, unknown>),
    }))
  } catch {
    return null
  }
}

export async function getTemplate(id: string): Promise<Template | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from("templates").select("*").eq("id", id).maybeSingle()
    if (data) {
      return {
        id: String(data.id),
        name: String(data.name),
        description: String(data.description ?? ""),
        preview_image: data.preview_image != null ? String(data.preview_image) : null,
        default_data: normalizeTemplateDocument(data.default_data as Record<string, unknown>),
      }
    }
  } catch {
    /* fall through */
  }
  return getStaticTemplate(id) ?? null
}

export async function listTemplates(): Promise<Template[]> {
  const fromDb = await fetchTemplatesFromDb()
  return fromDb ?? STATIC_TEMPLATES
}

export function draftFromTemplate(template: Template) {
  return editorStateFromDocument(template.id, template.default_data)
}

export { normalizeTemplateDocument as normalizeDraftData }

export function mergeDocument(
  base: TemplateDocument,
  patch: Partial<TemplateDocument>,
): TemplateDocument {
  return normalizeTemplateDocument({
    ...base,
    ...patch,
    theme: { ...base.theme, ...patch.theme },
    profile: { ...base.profile, ...patch.profile },
    links: patch.links ?? base.links,
    sections: patch.sections ?? base.sections,
  })
}

/** Ensure template row exists so profile_drafts FK does not fail on live DBs. */
export async function ensureTemplateInDb(templateId: string): Promise<boolean> {
  const staticTemplate = getStaticTemplate(templateId)
  if (!staticTemplate) return false

  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from("templates").select("id").eq("id", templateId).maybeSingle()
    if (data) return true

    const { error } = await supabase.from("templates").insert({
      id: staticTemplate.id,
      name: staticTemplate.name,
      description: staticTemplate.description,
      preview_image: staticTemplate.preview_image,
      default_data: staticTemplate.default_data,
    })

    if (error && !/duplicate|unique/i.test(error.message)) return false
    return true
  } catch {
    return false
  }
}

import type { TemplateDocument } from "@/lib/editor-state"
import type { MarketplaceTemplate } from "@/lib/templates/catalog"

const FAVORITES_KEY = "xhuma_template_favorites"
const RECENT_KEY = "xhuma_template_recent"
const SAVED_KEY = "xhuma_my_templates"
const AI_GENERATED_KEY = "xhuma_ai_templates"

export type SavedUserTemplate = MarketplaceTemplate & {
  savedAt: string
  source: "custom" | "duplicate" | "ai"
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, data: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    /* quota */
  }
}

export function getFavoriteTemplateIds(): string[] {
  return readJson<string[]>(FAVORITES_KEY, [])
}

export function toggleFavoriteTemplate(id: string): string[] {
  const favs = getFavoriteTemplateIds()
  const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]
  writeJson(FAVORITES_KEY, next)
  return next
}

export function getRecentTemplateIds(): string[] {
  return readJson<string[]>(RECENT_KEY, [])
}

export function pushRecentTemplate(id: string) {
  const recent = getRecentTemplateIds().filter((x) => x !== id)
  writeJson(RECENT_KEY, [id, ...recent].slice(0, 12))
}

export function getSavedTemplates(): SavedUserTemplate[] {
  return readJson<SavedUserTemplate[]>(SAVED_KEY, [])
}

export function saveUserTemplate(
  name: string,
  document: TemplateDocument,
  source: SavedUserTemplate["source"] = "custom",
): SavedUserTemplate {
  const saved: SavedUserTemplate = {
    id: `saved-${Date.now()}`,
    name,
    description: "My saved template",
    preview_image: null,
    category: "Personal Brand",
    tags: [],
    aiReady: true,
    baseId: "custom",
    default_data: document,
    addedAt: new Date().toISOString().slice(0, 10),
    savedAt: new Date().toISOString(),
    source,
  }
  const list = [saved, ...getSavedTemplates()].slice(0, 20)
  writeJson(SAVED_KEY, list)
  return saved
}

export function getAiGeneratedTemplates(): SavedUserTemplate[] {
  return readJson<SavedUserTemplate[]>(AI_GENERATED_KEY, [])
}

export function saveAiGeneratedTemplate(name: string, document: TemplateDocument): SavedUserTemplate {
  const saved = saveUserTemplate(name, document, "ai")
  const aiList = [saved, ...getAiGeneratedTemplates()].slice(0, 10)
  writeJson(AI_GENERATED_KEY, aiList)
  writeJson(SAVED_KEY, [saved, ...getSavedTemplates().filter((t) => t.id !== saved.id)].slice(0, 20))
  return saved
}

export function stashAiTemplateDraft(document: TemplateDocument) {
  if (typeof window === "undefined") return
  sessionStorage.setItem("xhuma_ai_template_draft", JSON.stringify(document))
}

export function consumeAiTemplateDraft(): TemplateDocument | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem("xhuma_ai_template_draft")
  sessionStorage.removeItem("xhuma_ai_template_draft")
  if (!raw) return null
  try {
    return JSON.parse(raw) as TemplateDocument
  } catch {
    return null
  }
}

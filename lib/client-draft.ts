import type { TemplateDocument } from "@/lib/editor-state"

const PENDING_DRAFT_KEY = "xhuma_pending_draft"

export type PendingDraft = {
  template_id: string
  theme_id?: string
  document?: TemplateDocument
  duplicate?: boolean
  at: number
}

export function stashPendingDraft(
  templateId: string,
  themeId?: string,
  extras?: { document?: TemplateDocument; duplicate?: boolean },
) {
  if (typeof window === "undefined") return
  const payload: PendingDraft = {
    template_id: templateId,
    theme_id: themeId,
    document: extras?.document,
    duplicate: extras?.duplicate,
    at: Date.now(),
  }
  sessionStorage.setItem(PENDING_DRAFT_KEY, JSON.stringify(payload))
}

export function peekPendingDraft(): PendingDraft | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(PENDING_DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingDraft
  } catch {
    return null
  }
}

export function consumePendingDraft(): PendingDraft | null {
  const pending = peekPendingDraft()
  if (!pending) return null
  sessionStorage.removeItem(PENDING_DRAFT_KEY)
  return pending
}

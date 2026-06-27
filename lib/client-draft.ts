const PENDING_DRAFT_KEY = "xhuma_pending_draft"

export function stashPendingDraft(templateId: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(
    PENDING_DRAFT_KEY,
    JSON.stringify({ template_id: templateId, at: Date.now() }),
  )
}

export function consumePendingDraft(): string | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(PENDING_DRAFT_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_DRAFT_KEY)
  try {
    const parsed = JSON.parse(raw) as { template_id?: string }
    return parsed.template_id ?? null
  } catch {
    return null
  }
}

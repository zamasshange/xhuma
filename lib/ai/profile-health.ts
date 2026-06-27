import type { EditorState } from "@/lib/editor-state"

export type HealthSuggestion = {
  id: string
  label: string
  detail: string
  points: number
  action?: "upload_avatar" | "add_bio" | "shorten_links" | "improve_labels" | "add_whatsapp" | "add_cta"
}

export type ProfileHealthResult = {
  score: number
  suggestions: HealthSuggestion[]
  checks: { id: string; label: string; passed: boolean }[]
}

const GENERIC_LABELS = /^(link|click here|website|instagram|youtube|tiktok|spotify|here)$/i

export function computeProfileHealth(state: EditorState): ProfileHealthResult {
  const { profile, links } = state
  const activeLinks = links.filter((l) => l.is_active !== false && l.title.trim())
  const suggestions: HealthSuggestion[] = []
  let score = 100

  const checks = [
    { id: "avatar", label: "Profile photo", passed: !!profile.avatar_url },
    { id: "bio", label: "Bio written", passed: (profile.bio?.trim().length ?? 0) >= 20 },
    { id: "name", label: "Display name", passed: profile.display_name.trim().length >= 2 },
    { id: "links", label: "At least one link", passed: activeLinks.length >= 1 },
    { id: "cta", label: "Strong button labels", passed: !activeLinks.some((l) => GENERIC_LABELS.test(l.title.trim())) },
    { id: "whatsapp", label: "WhatsApp or contact link", passed: activeLinks.some((l) => /whatsapp|wa\.me/i.test(l.url + l.title)) },
    { id: "count", label: "Link count (≤8)", passed: activeLinks.length <= 8 },
  ]

  if (!profile.avatar_url) {
    score -= 15
    suggestions.push({
      id: "avatar",
      label: "Add a profile photo",
      detail: "Pages with a photo get more trust and clicks.",
      points: 15,
      action: "upload_avatar",
    })
  }

  if ((profile.bio?.trim().length ?? 0) < 20) {
    score -= 12
    suggestions.push({
      id: "bio",
      label: "Write a stronger bio",
      detail: "A clear bio helps visitors know who you are in seconds.",
      points: 12,
      action: "add_bio",
    })
  }

  if (activeLinks.length === 0) {
    score -= 20
    suggestions.push({
      id: "links",
      label: "Add your first link",
      detail: "Give visitors somewhere to go — start with your main platform.",
      points: 20,
    })
  }

  if (activeLinks.length > 8) {
    score -= 8
    suggestions.push({
      id: "many-links",
      label: "Simplify your links",
      detail: "More than 8 buttons can overwhelm mobile visitors.",
      points: 8,
      action: "shorten_links",
    })
  }

  const weakLabels = activeLinks.filter((l) => GENERIC_LABELS.test(l.title.trim()) || l.title.length < 4)
  if (weakLabels.length > 0) {
    score -= 10
    suggestions.push({
      id: "labels",
      label: "Improve button labels",
      detail: `${weakLabels.length} link(s) use generic text — try action-led CTAs.`,
      points: 10,
      action: "improve_labels",
    })
  }

  const hasWhatsapp = activeLinks.some((l) => /whatsapp|wa\.me/i.test(l.url + l.title))
  if (!hasWhatsapp && activeLinks.length > 0) {
    score -= 5
    suggestions.push({
      id: "whatsapp",
      label: "Add WhatsApp",
      detail: "South African audiences love booking and chatting on WhatsApp.",
      points: 5,
      action: "add_whatsapp",
    })
  }

  const broken = activeLinks.filter((l) => l.url.trim() && l.url !== "#" && !/^https?:\/\//i.test(l.url))
  if (broken.length > 0) {
    score -= 8
    suggestions.push({
      id: "urls",
      label: "Fix link URLs",
      detail: `${broken.length} link(s) may be missing https://`,
      points: 8,
    })
  }

  const dupTitles = activeLinks.filter(
    (l, i) => activeLinks.findIndex((x) => x.title.toLowerCase() === l.title.toLowerCase()) !== i,
  )
  if (dupTitles.length > 0) {
    score -= 5
    suggestions.push({
      id: "dupes",
      label: "Remove duplicate links",
      detail: "You have buttons with the same label — visitors may get confused.",
      points: 5,
    })
  }

  score = Math.max(0, Math.min(100, score))

  return { score, suggestions, checks }
}

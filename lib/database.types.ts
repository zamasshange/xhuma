import type { LinkCardStyle } from "@/lib/link-card-styles"
import type { PageSection } from "@/lib/editor-sections"

export type ProfileTheme = {
  bg: string
  text: string
  button: string
  radius: string
  button_text?: string
  button_style?: "rounded" | "wavy" | "pill"
  /** Link button visual style (rounded, glass, comic, etc.) */
  link_style?: LinkCardStyle
  /** Social icon row on profile: brand colours or match link buttons */
  social_icon_style?: "brand" | "theme"
  /** Full-bleed background image (bio.link theme art) */
  bg_image?: string
  /** Editor / picker reference */
  preset_id?: string
  /** Dynamic page sections (persisted in theme_json for live profiles) */
  page_sections?: PageSection[]
}

export type DbLink = {
  id: string
  user_id: string
  title: string
  url: string
  icon?: string | null
  position: number
  clicks: number
  is_active: boolean
  created_at: string
}

export type DbProfile = {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  theme_json: ProfileTheme
  template_id?: string | null
  created_at: string
}

import type { TemplateDocument } from "@/lib/editor-state"

export type ProfileDraft = {
  session_id: string
  template_id: string
  data_json: TemplateDocument
  updated_at: string
}

export const DEFAULT_THEME: ProfileTheme = {
  bg: "#0f0f0f",
  text: "#ffffff",
  button: "#0d0c22",
  button_text: "#ffffff",
  radius: "14px",
}

/** Normalize theme — strip third-party mockup screenshots, keep Xhuma backgrounds */
export function themeForRender(theme: ProfileTheme): ProfileTheme {
  const merged = { ...DEFAULT_THEME, ...theme }
  const bg = merged.bg_image
  if (bg && bg.includes("bio.link/_nuxt")) {
    const { bg_image: _removed, ...rest } = merged
    return rest
  }
  return merged
}

export function mapProfile(row: Record<string, unknown>): DbProfile {
  const theme = (row.theme_json ?? row.theme ?? DEFAULT_THEME) as ProfileTheme
  return {
    id: String(row.id),
    username: String(row.username),
    display_name: String(row.display_name ?? ""),
    bio: row.bio != null ? String(row.bio) : null,
    avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
    theme_json: themeForRender({ ...DEFAULT_THEME, ...theme }),
    template_id: row.template_id != null ? String(row.template_id) : null,
    created_at: String(row.created_at),
  }
}

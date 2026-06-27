export type ProfileTheme = {
  bg: string
  text: string
  button: string
  radius: string
  button_text?: string
  button_style?: "rounded" | "wavy" | "pill"
  /** Full-bleed background image (bio.link theme art) */
  bg_image?: string
  /** Editor / picker reference */
  preset_id?: string
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
  button: "#7c3aed",
  radius: "14px",
}

export function mapProfile(row: Record<string, unknown>): DbProfile {
  const theme = (row.theme_json ?? row.theme ?? DEFAULT_THEME) as ProfileTheme
  return {
    id: String(row.id),
    username: String(row.username),
    display_name: String(row.display_name ?? ""),
    bio: row.bio != null ? String(row.bio) : null,
    avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
    theme_json: { ...DEFAULT_THEME, ...theme },
    template_id: row.template_id != null ? String(row.template_id) : null,
    created_at: String(row.created_at),
  }
}

export type ProfileTheme = {
  bg: string
  text: string
  button: string
  style: "rounded" | "pill" | "square"
}

export type DbProfile = {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  theme: ProfileTheme
  created_at: string
  updated_at: string
}

export type DbLink = {
  id: string
  user_id: string
  title: string
  url: string
  position: number
  clicks: number
  is_active: boolean
  created_at: string
}

export const DEFAULT_THEME: ProfileTheme = {
  bg: "#0d0c22",
  text: "#ffffff",
  button: "#7c3aed",
  style: "rounded",
}

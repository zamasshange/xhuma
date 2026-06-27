import { bioThemes } from "@/data/bio-link"
import type { ProfileTheme } from "@/lib/database.types"

export type ThemePreset = {
  id: string
  name: string
  image: string
  theme: ProfileTheme
}

const COLOR_MAP: Record<string, Omit<ProfileTheme, "bg_image" | "preset_id">> = {
  basic: { bg: "#ffffff", text: "#0d0c22", button: "#e8e8ec", button_text: "#0d0c22", radius: "14px" },
  summer: {
    bg: "#38bdf8",
    text: "#ffffff",
    button: "#facc15",
    button_text: "#0d0c22",
    radius: "0",
    button_style: "wavy",
  },
  retro: { bg: "#f5f0e8", text: "#1a1a1a", button: "#1a1a1a", radius: "8px" },
  xmas: { bg: "#14532d", text: "#ffffff", button: "#166534", button_text: "#ffffff", radius: "999px", button_style: "pill" },
  pride: { bg: "#1a0a2e", text: "#ffffff", button: "#ffffff", button_text: "#0d0c22", radius: "999px", button_style: "pill" },
  rainy: { bg: "#0f172a", text: "#e2e8f0", button: "rgba(255,255,255,0.15)", button_text: "#ffffff", radius: "999px", button_style: "pill" },
  strawberry: {
    bg: "#fce7f3",
    text: "#831843",
    button: "#ec4899",
    button_text: "#ffffff",
    radius: "999px",
    button_style: "pill",
  },
  chameleon: { bg: "#d1fae5", text: "#064e3b", button: "#047857", button_text: "#ffffff", radius: "14px" },
  desert: { bg: "#d6c6a5", text: "#3d2914", button: "#92400e", button_text: "#ffffff", radius: "12px" },
}

const EXTRA_PRESETS: ThemePreset[] = [
  {
    id: "carbon",
    name: "Carbon",
    image: bioThemes.find((t) => t.id === "basic")!.image,
    theme: { bg: "#0a0a0a", text: "#ffffff", button: "#262626", radius: "14px", preset_id: "carbon" },
  },
  {
    id: "neon",
    name: "Neon",
    image: bioThemes.find((t) => t.id === "rainy")!.image,
    theme: { bg: "#1e0a3c", text: "#ffffff", button: "#a855f7", radius: "14px", preset_id: "neon" },
  },
  {
    id: "minimal",
    name: "Minimal",
    image: bioThemes.find((t) => t.id === "basic")!.image,
    theme: { bg: "#fafafa", text: "#171717", button: "#ffffff", button_text: "#171717", radius: "4px", preset_id: "minimal" },
  },
]

function buildPreset(id: string, name: string, image: string): ThemePreset {
  const colors = COLOR_MAP[id] ?? COLOR_MAP.basic
  return {
    id,
    name,
    image,
    theme: { ...colors, bg_image: image, preset_id: id },
  }
}

export const THEME_PRESETS: ThemePreset[] = [
  ...bioThemes.map((t) => buildPreset(t.id, t.name, t.image)),
  ...EXTRA_PRESETS.map((p) => ({ ...p, theme: { ...p.theme, bg_image: p.image } })),
]

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id)
}

export function themeWithBackground(theme: ProfileTheme, image?: string | null): ProfileTheme {
  if (theme.bg_image) return theme
  if (!image) return theme
  return { ...theme, bg_image: image }
}

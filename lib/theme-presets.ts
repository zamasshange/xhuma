import { bioThemes } from "@/data/bio-link"
import type { ProfileTheme } from "@/lib/database.types"
import { themeForRender } from "@/lib/database.types"
import { themeBackgroundForPreset } from "@/lib/theme-backgrounds"

export type ThemePreset = {
  id: string
  name: string
  /** Gallery thumbnail */
  image: string
  theme: ProfileTheme
}

const COLOR_MAP: Record<string, Omit<ProfileTheme, "bg_image" | "preset_id">> = {
  basic: { bg: "#ffffff", text: "#0d0c22", button: "#0d0c22", button_text: "#ffffff", radius: "14px" },
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
  rainy: { bg: "#0f172a", text: "#e2e8f0", button: "#0d0c22", button_text: "#ffffff", radius: "999px", button_style: "pill" },
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

const EXTRA_PRESET_META: { id: string; name: string }[] = [
  { id: "carbon", name: "Carbon" },
  { id: "neon", name: "Neon" },
  { id: "minimal", name: "Minimal" },
]

const EXTRA_THEME_COLORS: Record<string, Omit<ProfileTheme, "bg_image" | "preset_id">> = {
  carbon: { bg: "#0a0a0a", text: "#ffffff", button: "#0d0c22", button_text: "#ffffff", radius: "14px" },
  neon: { bg: "#1e0a3c", text: "#ffffff", button: "#a855f7", radius: "14px" },
  minimal: { bg: "#fafafa", text: "#171717", button: "#ffffff", button_text: "#171717", radius: "4px" },
}

function buildPreset(id: string, name: string): ThemePreset {
  const colors = COLOR_MAP[id] ?? EXTRA_THEME_COLORS[id] ?? COLOR_MAP.basic
  const bgImage = themeBackgroundForPreset(id)
  return {
    id,
    name,
    image: bgImage ?? bioThemes.find((t) => t.id === id)?.image ?? "",
    theme: {
      ...colors,
      preset_id: id,
      ...(bgImage ? { bg_image: bgImage } : {}),
    },
  }
}

export const THEME_PRESETS: ThemePreset[] = [
  ...bioThemes.map((t) => buildPreset(t.id, t.name)),
  ...EXTRA_PRESET_META.map((t) => buildPreset(t.id, t.name)),
]

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id)
}

/** Attach Xhuma background art for live preview / storage */
export function resolveThemeBackground(theme: ProfileTheme): ProfileTheme {
  const merged = themeForRender(theme)
  if (merged.bg_image) return merged
  if (merged.preset_id) {
    const bg = themeBackgroundForPreset(merged.preset_id)
    if (bg) return { ...merged, bg_image: bg }
  }
  return merged
}

export function themeWithBackground(theme: ProfileTheme, image?: string | null): ProfileTheme {
  const base = resolveThemeBackground(theme)
  if (base.bg_image || !image) return base
  return { ...base, bg_image: image }
}

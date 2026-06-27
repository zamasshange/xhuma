import back1 from "@/lib/images/back1.avif"
import back2 from "@/lib/images/back2.avif"
import back3 from "@/lib/images/back3.avif"
import back4 from "@/lib/images/back4.avif"
import back5 from "@/lib/images/back5.jpg"
import back6 from "@/lib/images/back6.avif"
import back7 from "@/lib/images/back7.jpg"
import back8 from "@/lib/images/back8.avif"
import back9 from "@/lib/images/back9.avif"
import back10 from "@/lib/images/back10.jpg"
import back11 from "@/lib/images/back11.jpg"
import back12 from "@/lib/images/back12.avif"

/** Xhuma-owned background art — safe for live profile pages (no baked-in mockup UI) */
export const THEME_BACKGROUND_BY_PRESET: Record<string, string> = {
  summer: back1.src,
  retro: back2.src,
  xmas: back3.src,
  basic: back4.src,
  rainy: back5.src,
  strawberry: back6.src,
  chameleon: back7.src,
  pride: back8.src,
  desert: back9.src,
  carbon: back10.src,
  neon: back11.src,
  minimal: back12.src,
}

export function themeBackgroundForPreset(presetId: string): string | undefined {
  return THEME_BACKGROUND_BY_PRESET[presetId]
}

export function isBioLinkMockupUrl(url?: string | null): boolean {
  if (!url) return false
  return url.includes("bio.link/_nuxt")
}

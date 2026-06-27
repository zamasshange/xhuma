/**
 * Full-resolution backgrounds served from /public — stable URLs, no webpack downscaling.
 * Regenerate with: node scripts/export-backgrounds.mjs
 */
/**
 * Full-resolution backgrounds served from /public — stable URLs, no webpack downscaling.
 * Regenerate with: node scripts/export-backgrounds.mjs
 */
export const THEME_BACKGROUND_BY_PRESET: Record<string, string> = {
  summer: "/backgrounds/summer.webp",
  retro: "/backgrounds/retro.webp",
  xmas: "/backgrounds/xmas.webp",
  basic: "/backgrounds/basic.webp",
  rainy: "/backgrounds/rainy.webp",
  strawberry: "/backgrounds/strawberry.webp",
  chameleon: "/backgrounds/chameleon.webp",
  pride: "/backgrounds/pride.webp",
  desert: "/backgrounds/desert.webp",
  carbon: "/backgrounds/carbon.webp",
  neon: "/backgrounds/neon.webp",
  minimal: "/backgrounds/minimal.webp",
}

/** Bio.link CDN hosts the original full-res theme art for presets with low-res local placeholders */
const CDN_BACKGROUND_BY_PRESET: Record<string, string> = {
  retro: "https://cdn.bio.link/themes/backgrounds/retro.jpg",
  xmas: "https://cdn.bio.link/themes/backgrounds/holiday.jpg",
  rainy: "https://cdn.bio.link/themes/backgrounds/rainy_night.jpg",
  chameleon: "https://cdn.bio.link/themes/backgrounds/chameleon.jpg",
  pride: "https://cdn.bio.link/themes/backgrounds/pride.jpg",
  desert: "https://cdn.bio.link/themes/backgrounds/desert.jpg",
}

/** Presets with native 3000px+ local art — prefer self-hosted files */
const LOCAL_HD_PRESETS = new Set(["summer", "basic", "strawberry"])

export function themeBackgroundForPreset(presetId: string): string | undefined {
  if (LOCAL_HD_PRESETS.has(presetId)) {
    return THEME_BACKGROUND_BY_PRESET[presetId]
  }
  return CDN_BACKGROUND_BY_PRESET[presetId] ?? THEME_BACKGROUND_BY_PRESET[presetId]
}

export function isBioLinkMockupUrl(url?: string | null): boolean {
  if (!url) return false
  return url.includes("bio.link/_nuxt")
}

/** Webpack-hashed imports are often low-res after bundling — re-resolve from preset instead */
export function isStaleBundledBackgroundUrl(url?: string | null): boolean {
  if (!url) return false
  return url.includes("/_next/static/media/")
}

import type { CSSProperties } from "react"
import type { ProfileTheme } from "@/lib/database.types"

/** Standard filled link button colors on profile pages */
export const PROFILE_LINK_BUTTON_BG = "#0d0c22"
export const PROFILE_LINK_BUTTON_TEXT = "#ffffff"

/** Visual style for link buttons on the public profile */
export type LinkCardStyle =
  | "rounded"
  | "square"
  | "pill"
  | "glass"
  | "comic"
  | "outline"
  | "soft"
  | "wavy"
  | "neon"

export const LINK_CARD_STYLES: {
  id: LinkCardStyle
  name: string
  hint: string
}[] = [
  { id: "rounded", name: "Rounded", hint: "Clean corners" },
  { id: "square", name: "Square", hint: "Sharp edges" },
  { id: "pill", name: "Pill", hint: "Fully round" },
  { id: "glass", name: "Glass", hint: "Frosted blur" },
  { id: "comic", name: "Comic", hint: "Bold & playful" },
  { id: "outline", name: "Outline", hint: "Border only" },
  { id: "soft", name: "Soft", hint: "Puffy shadow" },
  { id: "wavy", name: "Wavy", hint: "Scalloped" },
  { id: "neon", name: "Neon", hint: "Glow edge" },
]

export function resolveLinkCardStyle(theme: ProfileTheme): LinkCardStyle {
  if (theme.link_style) return theme.link_style
  if (theme.button_style === "wavy") return "wavy"
  if (theme.button_style === "pill" || theme.radius === "999px") return "pill"
  return "rounded"
}

export function resolveLinkButtonColors(_theme: ProfileTheme): { bg: string; text: string } {
  return {
    bg: PROFILE_LINK_BUTTON_BG,
    text: PROFILE_LINK_BUTTON_TEXT,
  }
}

export function linkCardClasses(style: LinkCardStyle): string {
  switch (style) {
    case "square":
      return "rounded-md font-medium shadow-sm"
    case "pill":
      return "rounded-full font-medium shadow-sm"
    case "glass":
      return "rounded-2xl font-medium shadow-sm"
    case "comic":
      return "profile-link-comic font-bold"
    case "outline":
      return "profile-link-outline font-semibold"
    case "soft":
      return "rounded-[20px] font-medium profile-link-soft"
    case "wavy":
      return "profile-link-wavy font-bold italic shadow-sm"
    case "neon":
      return "rounded-xl font-semibold profile-link-neon"
    default:
      return "rounded-2xl font-medium shadow-sm"
  }
}

export function linkCardInlineStyle(
  style: LinkCardStyle,
  theme: ProfileTheme,
): CSSProperties {
  const { bg, text } = resolveLinkButtonColors(theme)
  const radius = theme.radius ?? "14px"

  switch (style) {
    case "glass":
      return {
        backgroundColor: bg,
        color: text,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: radius,
      }
    case "comic":
      return {
        backgroundColor: bg,
        color: text,
        border: `2.5px solid ${bg}`,
        boxShadow: `4px 4px 0 ${bg}`,
        filter: "brightness(1.05)",
      }
    case "outline":
      return {
        backgroundColor: "transparent",
        color: text,
        border: `2px solid ${text}`,
        borderRadius: radius,
      }
    case "soft":
      return {
        backgroundColor: bg,
        color: text,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        borderRadius: radius,
      }
    case "neon":
      return {
        backgroundColor: bg,
        color: text,
        boxShadow: `0 0 16px ${bg}80, inset 0 0 0 1px rgba(255,255,255,0.1)`,
        borderRadius: radius,
      }
    case "wavy":
      return { backgroundColor: bg, color: text, borderRadius: radius }
    case "pill":
      return { backgroundColor: bg, color: text, borderRadius: "999px" }
    case "square":
      return { backgroundColor: bg, color: text, borderRadius: "6px" }
    default:
      return {
        backgroundColor: bg,
        color: text,
        borderRadius: radius,
      }
  }
}

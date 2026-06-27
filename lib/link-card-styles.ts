import type { CSSProperties } from "react"
import type { ProfileTheme } from "@/lib/database.types"

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

export function linkCardClasses(style: LinkCardStyle): string {
  switch (style) {
    case "square":
      return "rounded-md font-medium shadow-sm"
    case "pill":
      return "rounded-full font-medium shadow-sm"
    case "glass":
      return "profile-link-glass font-medium"
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
  const buttonText = theme.button_text ?? theme.text
  const base: CSSProperties = { color: buttonText }

  switch (style) {
    case "glass":
      return {
        ...base,
        backgroundColor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.28)",
        backdropFilter: "blur(12px)",
      }
    case "comic":
      return {
        ...base,
        backgroundColor: theme.button,
        border: "2.5px solid #0d0c22",
        boxShadow: "4px 4px 0 #0d0c22",
      }
    case "outline":
      return {
        ...base,
        backgroundColor: "transparent",
        border: `2px solid ${theme.button}`,
        color: theme.button_text ?? theme.button,
      }
    case "soft":
      return {
        ...base,
        backgroundColor: theme.button,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
      }
    case "neon":
      return {
        ...base,
        backgroundColor: theme.button,
        boxShadow: `0 0 20px ${theme.button}88, inset 0 0 0 1px rgba(255,255,255,0.15)`,
      }
    case "wavy":
      return { ...base, backgroundColor: theme.button }
    case "pill":
      return { ...base, backgroundColor: theme.button, borderRadius: "999px" }
    case "square":
      return { ...base, backgroundColor: theme.button, borderRadius: "6px" }
    default:
      return {
        ...base,
        backgroundColor: theme.button,
        borderRadius: theme.radius ?? "14px",
      }
  }
}

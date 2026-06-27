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

/** Map legacy translucent/grey button colors to solid black */
export function resolveButtonTheme(theme: ProfileTheme): ProfileTheme {
  const btn = theme.button ?? ""
  const needsBlack =
    btn.includes("rgba") ||
    btn === "#262626" ||
    btn === "#e8e8ec" ||
    btn === "rgba(255,255,255,0.9)"
  if (needsBlack) {
    return { ...theme, button: "#0d0c22", button_text: theme.button_text ?? "#ffffff" }
  }
  return theme
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
  const resolved = resolveButtonTheme(theme)
  const buttonText = resolved.button_text ?? resolved.text
  const base: CSSProperties = { color: buttonText }

  switch (style) {
    case "glass":
      return {
        ...base,
        backgroundColor: resolved.button || "#0d0c22",
        color: resolved.button_text ?? "#ffffff",
        border: "1px solid rgba(255,255,255,0.1)",
      }
    case "comic":
      return {
        ...base,
        backgroundColor: resolved.button,
        border: "2.5px solid #0d0c22",
        boxShadow: "4px 4px 0 #0d0c22",
      }
    case "outline":
      return {
        ...base,
        backgroundColor: "transparent",
        border: `2px solid ${resolved.button}`,
        color: resolved.button_text ?? resolved.button,
      }
    case "soft":
      return {
        ...base,
        backgroundColor: resolved.button,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
      }
    case "neon":
      return {
        ...base,
        backgroundColor: resolved.button,
        boxShadow: `0 0 20px ${resolved.button}88, inset 0 0 0 1px rgba(255,255,255,0.15)`,
      }
    case "wavy":
      return { ...base, backgroundColor: resolved.button }
    case "pill":
      return { ...base, backgroundColor: resolved.button, borderRadius: "999px" }
    case "square":
      return { ...base, backgroundColor: resolved.button, borderRadius: "6px" }
    default:
      return {
        ...base,
        backgroundColor: resolved.button,
        borderRadius: resolved.radius ?? "14px",
      }
  }
}

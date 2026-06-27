import type { ProfileTheme } from "@/lib/database.types"
import { bioThemes } from "@/data/bio-link"

export type OnboardingPlatform = {
  id: string
  label: string
  icon: "instagram" | "youtube" | "tiktok" | "facebook" | "x" | "snapchat" | "coffee" | "website" | "spotify" | "linkedin"
  linkTitle?: string
  urlPlaceholder?: string
}

export const onboardingPlatformsPrimary: OnboardingPlatform[] = [
  { id: "instagram", label: "Instagram", icon: "instagram", linkTitle: "Instagram", urlPlaceholder: "https://instagram.com/you" },
  { id: "youtube", label: "YouTube", icon: "youtube", linkTitle: "YouTube", urlPlaceholder: "https://youtube.com/@you" },
  { id: "tiktok", label: "TikTok", icon: "tiktok", linkTitle: "TikTok", urlPlaceholder: "https://tiktok.com/@you" },
  { id: "facebook", label: "Facebook", icon: "facebook", linkTitle: "Facebook", urlPlaceholder: "https://facebook.com/you" },
  { id: "x", label: "Twitter/X", icon: "x", linkTitle: "X", urlPlaceholder: "https://x.com/you" },
]

export const onboardingPlatformsExtra: OnboardingPlatform[] = [
  { id: "snapchat", label: "Snapchat", icon: "snapchat", linkTitle: "Snapchat", urlPlaceholder: "https://snapchat.com/add/you" },
  { id: "coffee", label: "Buy Me a Coffee", icon: "coffee", linkTitle: "Buy Me a Coffee", urlPlaceholder: "https://buymeacoffee.com/you" },
  { id: "website", label: "I have a website", icon: "website", linkTitle: "My Website", urlPlaceholder: "https://yoursite.com" },
  { id: "spotify", label: "Spotify", icon: "spotify", linkTitle: "Spotify", urlPlaceholder: "https://open.spotify.com/artist/..." },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin", linkTitle: "LinkedIn", urlPlaceholder: "https://linkedin.com/in/you" },
]

export const onboardingThemePresets: {
  id: string
  name: string
  image: string
  live?: boolean
  theme: ProfileTheme
}[] = [
  { id: "basic", name: "Basics", image: bioThemes.find((t) => t.id === "basic")!.image, theme: { bg: "#ffffff", text: "#0d0c22", button: "#e8e8ec", radius: "14px" } },
  { id: "summer", name: "Summer", image: bioThemes.find((t) => t.id === "summer")!.image, theme: { bg: "#38bdf8", text: "#ffffff", button: "#facc15", button_text: "#0d0c22", radius: "0", button_style: "wavy" } },
  { id: "retro", name: "Retro", image: bioThemes.find((t) => t.id === "retro")!.image, theme: { bg: "#f5f0e8", text: "#1a1a1a", button: "#1a1a1a", radius: "8px" } },
  { id: "xmas", name: "Holiday", image: bioThemes.find((t) => t.id === "xmas")!.image, theme: { bg: "#14532d", text: "#ffffff", button: "#22c55e", radius: "14px" } },
  { id: "pride", name: "Pride", image: bioThemes.find((t) => t.id === "pride")!.image, live: true, theme: { bg: "#1a0a2e", text: "#ffffff", button: "#f97316", radius: "14px" } },
  { id: "rainy", name: "Rainy Night", image: bioThemes.find((t) => t.id === "rainy")!.image, live: true, theme: { bg: "#0f172a", text: "#e2e8f0", button: "#38bdf8", radius: "14px" } },
  { id: "strawberry", name: "Strawberry", image: bioThemes.find((t) => t.id === "strawberry")!.image, live: true, theme: { bg: "#fce7f3", text: "#831843", button: "#ec4899", button_text: "#ffffff", radius: "999px", button_style: "pill" } },
  { id: "chameleon", name: "Chameleon", image: bioThemes.find((t) => t.id === "chameleon")!.image, live: true, theme: { bg: "#d1fae5", text: "#064e3b", button: "#047857", radius: "14px" } },
  { id: "desert", name: "Desert", image: bioThemes.find((t) => t.id === "desert")!.image, theme: { bg: "#d6c6a5", text: "#3d2914", button: "#92400e", radius: "12px" } },
  { id: "carbon", name: "Carbon", image: bioThemes.find((t) => t.id === "basic")!.image, theme: { bg: "#0a0a0a", text: "#ffffff", button: "#262626", radius: "14px" } },
  { id: "neon", name: "Neon", image: bioThemes.find((t) => t.id === "rainy")!.image, live: true, theme: { bg: "#1e0a3c", text: "#ffffff", button: "#a855f7", radius: "14px" } },
  { id: "minimal", name: "Minimal", image: bioThemes.find((t) => t.id === "basic")!.image, theme: { bg: "#fafafa", text: "#171717", button: "#ffffff", radius: "4px" } },
]

export const ONBOARDING_STEPS = [
  "platforms",
  "platforms-extra",
  "theme",
  "avatar",
  "profile",
  "links",
  "preview",
] as const

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

export function getAllPlatforms() {
  return [...onboardingPlatformsPrimary, ...onboardingPlatformsExtra]
}

export function platformById(id: string) {
  return getAllPlatforms().find((p) => p.id === id)
}

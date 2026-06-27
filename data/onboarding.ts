import { THEME_PRESETS } from "@/lib/theme-presets"

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

export const onboardingThemePresets = THEME_PRESETS.map((p) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  live: ["pride", "rainy", "strawberry", "chameleon", "neon"].includes(p.id),
  theme: p.theme,
}))

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

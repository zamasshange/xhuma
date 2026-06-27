import type { DbLink, DbProfile, ProfileTheme } from "@/lib/database.types"

export const SUMMER_THEME: ProfileTheme = {
  bg: "#38bdf8",
  text: "#ffffff",
  button: "#facc15",
  button_text: "#0d0c22",
  radius: "0",
  button_style: "wavy",
  preset_id: "summer",
}

export const DEMO_SUMMER_PROFILE: DbProfile = {
  id: "demo",
  username: "annaleung",
  display_name: "Anna Leung",
  bio: "Simplicity, style, and side quests.",
  avatar_url: "https://bio.link/_nuxt/user2.CiMA-Ti0.png",
  theme_json: SUMMER_THEME,
  created_at: new Date().toISOString(),
}

export const DEMO_SUMMER_LINKS: Pick<DbLink, "id" | "title" | "url">[] = [
  { id: "1", title: "Follow me on Instagram", url: "#" },
  { id: "2", title: "Join My Newsletter", url: "#" },
  { id: "3", title: "Buy Me a Coffee", url: "#" },
  { id: "4", title: "Shop My Merch", url: "#" },
  { id: "5", title: "New video is out!", url: "#" },
]

export const DEMO_DARK_PROFILE: DbProfile = {
  id: "demo-dark",
  username: "creator",
  display_name: "Zama",
  bio: "Creator · Links · AI",
  avatar_url: null,
  theme_json: {
    bg: "#0f0f0f",
    text: "#ffffff",
    button: "#7c3aed",
    radius: "14px",
    button_style: "rounded",
  },
  created_at: new Date().toISOString(),
}

export const DEMO_DARK_LINKS: Pick<DbLink, "id" | "title" | "url">[] = [
  { id: "1", title: "Instagram", url: "#" },
  { id: "2", title: "YouTube", url: "#" },
  { id: "3", title: "My Website", url: "#" },
]

export const PREMIUM_THEME: ProfileTheme = {
  bg: "#000000",
  text: "#ffffff",
  button: "#2a2a2a",
  button_text: "#ffffff",
  radius: "16px",
  preset_id: "carbon",
}

/** Hero / marketing showcase — matches premium dark link-in-bio aesthetic */
export const DEMO_PREMIUM_PROFILE: DbProfile = {
  id: "demo-premium",
  username: "jordanpaul",
  display_name: "Jordan Paul",
  bio: "Curated bits from life and work.",
  avatar_url: "https://bio.link/_nuxt/user3.w1PRNQjx.png",
  theme_json: PREMIUM_THEME,
  created_at: new Date().toISOString(),
}

export const DEMO_PREMIUM_LINKS: Pick<DbLink, "id" | "title" | "url" | "icon">[] = [
  { id: "1", title: "Follow me on Instagram", url: "#", icon: "instagram" },
  { id: "2", title: "Subscribe on Youtube", url: "#", icon: "youtube" },
  { id: "3", title: "Shop My Merch", url: "#", icon: "link" },
]

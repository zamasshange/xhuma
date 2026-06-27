import type { ProfileCategory } from "@/lib/types"

export type ExploreCard = {
  username: string
  name: string
  headline: string
  avatar: string
  accent: string
  category: ProfileCategory
  followers: string
}

export const exploreCategories: (ProfileCategory | "All")[] = [
  "All",
  "Creators",
  "Artists",
  "Businesses",
  "Developers",
  "Musicians",
  "Designers",
  "Photographers",
]

export const exploreCards: ExploreCard[] = [
  { username: "ariastone", name: "Aria Stone", headline: "Music Producer & DJ", avatar: "/images/avatars/aria.png", accent: "#7c5cff", category: "Musicians", followers: "128k" },
  { username: "mayadev", name: "Maya Chen", headline: "Full-Stack Engineer", avatar: "/images/avatars/maya.png", accent: "#4f7cff", category: "Developers", followers: "204k" },
  { username: "leoart", name: "Leo Martins", headline: "Visual Artist", avatar: "/images/avatars/leo.png", accent: "#9b5cff", category: "Artists", followers: "86k" },
  { username: "zoelens", name: "Zoe Park", headline: "Travel Photographer", avatar: "/images/avatars/zoe.png", accent: "#4fb0ff", category: "Photographers", followers: "312k" },
  { username: "noahbuilds", name: "Noah Reed", headline: "Founder & Designer", avatar: "/images/avatars/noah.png", accent: "#6a5cff", category: "Designers", followers: "54k" },
  { username: "kaistudio", name: "Kai Rivera", headline: "Brand Strategist", avatar: "/images/avatars/kai.png", accent: "#5c7cff", category: "Businesses", followers: "97k" },
  { username: "ariastone", name: "Nova Collective", headline: "Content Creators", avatar: "/images/avatars/maya.png", accent: "#8a5cff", category: "Creators", followers: "421k" },
  { username: "leoart", name: "Iris Vale", headline: "3D Designer", avatar: "/images/avatars/zoe.png", accent: "#5ca8ff", category: "Designers", followers: "73k" },
  { username: "mayadev", name: "Atlas Dev", headline: "DevTools Maker", avatar: "/images/avatars/kai.png", accent: "#4f7cff", category: "Developers", followers: "61k" },
]

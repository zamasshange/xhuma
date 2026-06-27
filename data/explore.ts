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
  { username: "leratophotos", name: "Lerato Nkosi", headline: "Photographer, Cape Town", avatar: "/images/avatars/aria.png", accent: "#7c5cff", category: "Photographers", followers: "128k" },
  { username: "djkabelo", name: "Kabelo Mokoena", headline: "DJ, Johannesburg", avatar: "/images/avatars/maya.png", accent: "#4f7cff", category: "Musicians", followers: "204k" },
  { username: "siphocodes", name: "Sipho Dlamini", headline: "Software Developer, Midrand", avatar: "/images/avatars/leo.png", accent: "#9b5cff", category: "Developers", followers: "86k" },
  { username: "nomsabeauty", name: "Nomsa Khumalo", headline: "Makeup Artist, Soweto", avatar: "/images/avatars/zoe.png", accent: "#4fb0ff", category: "Artists", followers: "312k" },
  { username: "zanelestyle", name: "Zanele Patel", headline: "Fashion Creator, Pretoria", avatar: "/images/avatars/noah.png", accent: "#6a5cff", category: "Creators", followers: "54k" },
  { username: "capebakes", name: "Cape Bakes Co.", headline: "Small Business, Durban", avatar: "/images/avatars/kai.png", accent: "#5c7cff", category: "Businesses", followers: "97k" },
  { username: "thandim", name: "Thandi Mthembu", headline: "Content Creator, Gqeberha", avatar: "/images/avatars/maya.png", accent: "#8a5cff", category: "Creators", followers: "421k" },
  { username: "amahleart", name: "Amahle Zulu", headline: "Visual Artist, Bloemfontein", avatar: "/images/avatars/zoe.png", accent: "#5ca8ff", category: "Artists", followers: "73k" },
  { username: "midrandtech", name: "Midrand Tech", headline: "DevTools Maker, Midrand", avatar: "/images/avatars/kai.png", accent: "#4f7cff", category: "Developers", followers: "61k" },
]

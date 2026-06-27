import type { SocialIconName } from "@/lib/infer-link-icon"

export type RecommendedLink = {
  title: string
  url: string
  icon: SocialIconName
  reason?: string
}

export type ProfessionId =
  | "musician"
  | "photographer"
  | "developer"
  | "business"
  | "creator"
  | "beauty"
  | "coach"

const SA_DEFAULTS: Record<ProfessionId, RecommendedLink[]> = {
  musician: [
    { title: "Listen on Spotify", url: "https://open.spotify.com", icon: "spotify", reason: "Essential for SA artists" },
    { title: "Apple Music", url: "https://music.apple.com", icon: "link", reason: "Reach iOS listeners" },
    { title: "YouTube", url: "https://youtube.com", icon: "youtube", reason: "Music videos & performances" },
    { title: "Book via WhatsApp", url: "https://wa.me/27", icon: "whatsapp", reason: "Popular for SA bookings" },
  ],
  photographer: [
    { title: "View My Portfolio", url: "https://", icon: "website", reason: "Showcase your best work" },
    { title: "Instagram", url: "https://instagram.com/", icon: "instagram", reason: "Visual-first platform" },
    { title: "Book a Shoot", url: "https://wa.me/27", icon: "whatsapp", reason: "Quick SA client enquiries" },
    { title: "Pricing & Packages", url: "https://", icon: "link", reason: "Set clear expectations" },
  ],
  developer: [
    { title: "GitHub", url: "https://github.com/", icon: "link", reason: "Show your code" },
    { title: "Portfolio", url: "https://", icon: "website", reason: "Case studies & projects" },
    { title: "LinkedIn", url: "https://linkedin.com/in/", icon: "linkedin", reason: "Professional network" },
    { title: "Blog / Articles", url: "https://", icon: "link", reason: "Share technical writing" },
  ],
  business: [
    { title: "WhatsApp Us", url: "https://wa.me/27", icon: "whatsapp", reason: "#1 channel for SA SMEs" },
    { title: "Find Us on Google Maps", url: "https://maps.google.com/", icon: "link", reason: "Local discovery" },
    { title: "Our Services", url: "https://", icon: "website", reason: "Explain what you offer" },
    { title: "Leave a Review", url: "https://", icon: "link", reason: "Build social proof" },
  ],
  creator: [
    { title: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { title: "TikTok", url: "https://tiktok.com/@", icon: "tiktok" },
    { title: "YouTube", url: "https://youtube.com/@", icon: "youtube" },
    { title: "Newsletter", url: "https://", icon: "link" },
  ],
  beauty: [
    { title: "Book on WhatsApp", url: "https://wa.me/27", icon: "whatsapp" },
    { title: "Instagram", url: "https://instagram.com/", icon: "instagram" },
    { title: "View Price List", url: "https://", icon: "link" },
    { title: "TikTok", url: "https://tiktok.com/@", icon: "tiktok" },
  ],
  coach: [
    { title: "Book a Session", url: "https://wa.me/27", icon: "whatsapp" },
    { title: "LinkedIn", url: "https://linkedin.com/in/", icon: "linkedin" },
    { title: "Free Resources", url: "https://", icon: "link" },
    { title: "Email Me", url: "mailto:hello@example.co.za", icon: "link" },
  ],
}

export function inferProfession(text: string): ProfessionId {
  const t = text.toLowerCase()
  if (/music|dj|artist|producer|spotify|band/.test(t)) return "musician"
  if (/photo|camera|wedding|portrait/.test(t)) return "photographer"
  if (/dev|engineer|code|software|github/.test(t)) return "developer"
  if (/salon|makeup|beauty|nails|hair/.test(t)) return "beauty"
  if (/coach|mentor|consult/.test(t)) return "coach"
  if (/business|shop|store|bakery|agency/.test(t)) return "business"
  return "creator"
}

export function getRecommendedLinks(professionOrBio: string): RecommendedLink[] {
  const id = inferProfession(professionOrBio)
  return SA_DEFAULTS[id]
}

export const PROFESSION_OPTIONS: { id: ProfessionId; label: string }[] = [
  { id: "creator", label: "Creator / Influencer" },
  { id: "musician", label: "Musician / DJ" },
  { id: "photographer", label: "Photographer" },
  { id: "developer", label: "Developer" },
  { id: "business", label: "Small Business" },
  { id: "beauty", label: "Beauty / Makeup" },
  { id: "coach", label: "Coach / Consultant" },
]

import type { Template, TemplateDocument } from "@/data/templates"
import { STATIC_TEMPLATES, getStaticTemplate } from "@/data/templates"
import { DEFAULT_THEME } from "@/lib/database.types"
import {
  BLANK_CANVAS_SECTIONS,
  BLANK_TEMPLATE_ID,
  sectionsToLegacyIds,
} from "@/lib/editor-sections"

export const TEMPLATE_CATEGORIES = [
  "Creator",
  "Influencer",
  "Musician",
  "Artist",
  "Photographer",
  "Videographer",
  "Developer",
  "Designer",
  "Portfolio",
  "Small Business",
  "Restaurant",
  "Beauty Salon",
  "Barber",
  "Makeup Artist",
  "Real Estate",
  "Church",
  "Podcast",
  "Streamer",
  "Student",
  "Freelancer",
  "Agency",
  "Online Store",
  "Fitness Coach",
  "Personal Brand",
  "Minimal",
  "Luxury",
  "Dark",
  "Colorful",
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]
export type TemplateTag = "featured" | "trending" | "new" | "popular" | "recent"

export type MarketplaceTemplate = {
  id: string
  name: string
  description: string
  preview_image: string | null
  category: TemplateCategory
  tags: TemplateTag[]
  aiReady: boolean
  baseId: string
  default_data: TemplateDocument
  addedAt: string
}

/** Marketplace entries derived from base templates + category variants */
const VARIANTS: Omit<MarketplaceTemplate, "default_data" | "preview_image">[] = [
  { id: "creator", name: "Creator", description: "Social links, video-ready layout", category: "Creator", tags: ["featured", "popular"], aiReady: true, baseId: "creator", addedAt: "2026-01-15" },
  { id: "influencer", name: "Influencer", description: "Bold links for growing audiences", category: "Influencer", tags: ["featured", "trending"], aiReady: true, baseId: "creator", addedAt: "2026-02-01" },
  { id: "musician", name: "Musician", description: "Streaming links and tour dates", category: "Musician", tags: ["featured", "popular"], aiReady: true, baseId: "musician", addedAt: "2026-01-10" },
  { id: "artist", name: "Artist", description: "Showcase work and commissions", category: "Artist", tags: ["trending"], aiReady: true, baseId: "portfolio", addedAt: "2026-02-10" },
  { id: "photographer", name: "Photographer", description: "Gallery and booking focus", category: "Photographer", tags: ["featured", "new"], aiReady: true, baseId: "portfolio", addedAt: "2026-03-01" },
  { id: "videographer", name: "Videographer", description: "Reels, YouTube, and showreel", category: "Videographer", tags: ["new"], aiReady: true, baseId: "creator", addedAt: "2026-03-05" },
  { id: "developer", name: "Developer", description: "GitHub, portfolio, and CV links", category: "Developer", tags: ["popular"], aiReady: true, baseId: "portfolio", addedAt: "2026-01-20" },
  { id: "designer", name: "Designer", description: "Case studies and Dribbble", category: "Designer", tags: ["trending"], aiReady: true, baseId: "portfolio", addedAt: "2026-02-15" },
  { id: "portfolio", name: "Portfolio", description: "Projects grid and contact", category: "Portfolio", tags: ["featured"], aiReady: true, baseId: "portfolio", addedAt: "2026-01-05" },
  { id: "business", name: "Small Business", description: "WhatsApp, services, and CTAs", category: "Small Business", tags: ["featured", "popular"], aiReady: true, baseId: "business", addedAt: "2026-01-08" },
  { id: "restaurant", name: "Restaurant", description: "Menu, reservations, and maps", category: "Restaurant", tags: ["trending"], aiReady: true, baseId: "business", addedAt: "2026-02-20" },
  { id: "beauty-salon", name: "Beauty Salon", description: "Bookings and price list", category: "Beauty Salon", tags: ["new"], aiReady: true, baseId: "business", addedAt: "2026-03-08" },
  { id: "barber", name: "Barber", description: "Walk-ins and WhatsApp bookings", category: "Barber", tags: ["recent"], aiReady: true, baseId: "business", addedAt: "2026-03-10" },
  { id: "makeup-artist", name: "Makeup Artist", description: "Instagram and bridal packages", category: "Makeup Artist", tags: ["new"], aiReady: true, baseId: "creator", addedAt: "2026-03-12" },
  { id: "real-estate", name: "Real Estate", description: "Listings and contact agent", category: "Real Estate", tags: ["popular"], aiReady: true, baseId: "business", addedAt: "2026-02-05" },
  { id: "church", name: "Church", description: "Sermons, events, and giving", category: "Church", tags: ["recent"], aiReady: true, baseId: "minimal", addedAt: "2026-03-01" },
  { id: "podcast", name: "Podcast", description: "Listen links and episodes", category: "Podcast", tags: ["trending"], aiReady: true, baseId: "musician", addedAt: "2026-02-12" },
  { id: "streamer", name: "Streamer", description: "Twitch, YouTube, and tips", category: "Streamer", tags: ["new"], aiReady: true, baseId: "creator", addedAt: "2026-03-15" },
  { id: "student", name: "Student", description: "CV, portfolio, and LinkedIn", category: "Student", tags: ["recent"], aiReady: true, baseId: "minimal", addedAt: "2026-03-18" },
  { id: "freelancer", name: "Freelancer", description: "Hire me and case studies", category: "Freelancer", tags: ["popular"], aiReady: true, baseId: "portfolio", addedAt: "2026-01-25" },
  { id: "agency", name: "Agency", description: "Services, team, and leads", category: "Agency", tags: ["featured"], aiReady: true, baseId: "business", addedAt: "2026-02-01" },
  { id: "online-store", name: "Online Store", description: "Product links and shop", category: "Online Store", tags: ["trending"], aiReady: true, baseId: "business", addedAt: "2026-02-28" },
  { id: "fitness-coach", name: "Fitness Coach", description: "Programs and bookings", category: "Fitness Coach", tags: ["new"], aiReady: true, baseId: "creator", addedAt: "2026-03-20" },
  { id: "personal-brand", name: "Personal Brand", description: "One link for your brand", category: "Personal Brand", tags: ["featured"], aiReady: true, baseId: "creator", addedAt: "2026-01-12" },
  { id: "minimal", name: "Minimal", description: "Clean links only", category: "Minimal", tags: ["popular"], aiReady: false, baseId: "minimal", addedAt: "2026-01-01" },
  { id: "luxury", name: "Luxury", description: "Premium black and gold feel", category: "Luxury", tags: ["featured"], aiReady: true, baseId: "minimal", addedAt: "2026-02-08" },
  { id: "dark", name: "Dark", description: "Moody dark theme layout", category: "Dark", tags: ["trending"], aiReady: true, baseId: "musician", addedAt: "2026-02-18" },
  { id: "colorful", name: "Colorful", description: "Bright, playful gradients", category: "Colorful", tags: ["new"], aiReady: true, baseId: "creator", addedAt: "2026-03-22" },
]

function buildMarketplaceEntry(v: (typeof VARIANTS)[number]): MarketplaceTemplate {
  const base = getStaticTemplate(v.baseId)
  return {
    ...v,
    preview_image: base?.preview_image ?? null,
    default_data: base?.default_data ?? STATIC_TEMPLATES[0].default_data,
  }
}

export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = VARIANTS.map(buildMarketplaceEntry)

export function getBlankTemplateDocument(): TemplateDocument {
  const pageSections = BLANK_CANVAS_SECTIONS
  return {
    layout: "blank",
    sections: sectionsToLegacyIds(pageSections),
    page_sections: pageSections,
    theme: { ...DEFAULT_THEME },
    profile: { display_name: "", bio: "", avatar_url: null },
    links: [],
  }
}

export function getMarketplaceTemplate(id: string): MarketplaceTemplate | null {
  if (id === BLANK_TEMPLATE_ID) {
    return {
      id: BLANK_TEMPLATE_ID,
      name: "Blank Canvas",
      description: "Start from scratch — add sections as you go",
      preview_image: null,
      category: "Minimal",
      tags: ["featured"],
      aiReady: true,
      baseId: BLANK_TEMPLATE_ID,
      default_data: getBlankTemplateDocument(),
      addedAt: "2026-01-01",
    }
  }
  return MARKETPLACE_TEMPLATES.find((t) => t.id === id) ?? null
}

export function resolveTemplateForCreate(id: string): {
  templateId: string
  document: TemplateDocument
} | null {
  const entry = getMarketplaceTemplate(id)
  if (!entry) {
    const legacy = getStaticTemplate(id)
    if (!legacy) return null
    return { templateId: legacy.id, document: legacy.default_data }
  }
  if (id === BLANK_TEMPLATE_ID) {
    return { templateId: BLANK_TEMPLATE_ID, document: getBlankTemplateDocument() }
  }
  return {
    templateId: id,
    document: {
      ...entry.default_data,
      layout: id,
      sections: entry.default_data.sections,
    },
  }
}

export function isKnownTemplateId(id: string): boolean {
  return id === BLANK_TEMPLATE_ID || !!getMarketplaceTemplate(id) || !!getStaticTemplate(id)
}

export function filterTemplates(opts: {
  query?: string
  category?: string
  tag?: TemplateTag
  tab?: "all" | "featured" | "trending" | "new" | "popular" | "my" | "recent" | "ai"
  favorites?: string[]
  recent?: string[]
  saved?: MarketplaceTemplate[]
}): MarketplaceTemplate[] {
  let list = [...MARKETPLACE_TEMPLATES]

  if (opts.tab === "my" && opts.saved?.length) {
    list = opts.saved
  } else if (opts.tab === "recent" && opts.recent?.length) {
    list = opts.recent
      .map((id) => getMarketplaceTemplate(id))
      .filter(Boolean) as MarketplaceTemplate[]
  } else if (opts.tab === "featured") {
    list = list.filter((t) => t.tags.includes("featured"))
  } else if (opts.tab === "trending") {
    list = list.filter((t) => t.tags.includes("trending"))
  } else if (opts.tab === "new" || opts.tab === "recent") {
    list = [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 12)
  } else if (opts.tab === "popular") {
    list = list.filter((t) => t.tags.includes("popular"))
  } else if (opts.tab === "ai") {
    list = list.filter((t) => t.aiReady)
  }

  if (opts.category && opts.category !== "All") {
    list = list.filter((t) => t.category === opts.category)
  }

  if (opts.tag) {
    list = list.filter((t) => t.tags.includes(opts.tag))
  }

  if (opts.query?.trim()) {
    const q = opts.query.toLowerCase()
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    )
  }

  if (opts.favorites?.length) {
    const favSet = new Set(opts.favorites)
    list = [...list].sort((a, b) => Number(favSet.has(b.id)) - Number(favSet.has(a.id)))
  }

  return list
}

export function duplicateTemplateDocument(doc: TemplateDocument): TemplateDocument {
  return JSON.parse(JSON.stringify(doc)) as TemplateDocument
}

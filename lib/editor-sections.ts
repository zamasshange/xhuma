/** Dynamic page section types for blank canvas / template layouts */
export type SectionType =
  | "profile"
  | "links"
  | "social_icons"
  | "about"
  | "gallery"
  | "video"
  | "music_embed"
  | "contact_form"
  | "whatsapp"
  | "booking"
  | "services"
  | "pricing"
  | "testimonials"
  | "faq"
  | "newsletter"
  | "map"
  | "store_links"
  | "donation"
  | "events"
  | "custom_html"

export type PageSection = {
  id: string
  type: SectionType
  title?: string
  collapsed?: boolean
  content: Record<string, unknown>
}

export const SECTION_CATALOG: {
  type: SectionType
  label: string
  description: string
  aiReady: boolean
}[] = [
  { type: "profile", label: "Profile Header", description: "Photo, name, and bio", aiReady: false },
  { type: "links", label: "Links", description: "Button links visitors tap", aiReady: false },
  { type: "social_icons", label: "Social Icons", description: "Icon row for platforms", aiReady: true },
  { type: "about", label: "About", description: "Longer intro text", aiReady: true },
  { type: "gallery", label: "Gallery", description: "Image grid showcase", aiReady: true },
  { type: "video", label: "Video", description: "Embed a video", aiReady: true },
  { type: "music_embed", label: "Music Embed", description: "Spotify or Apple Music", aiReady: true },
  { type: "contact_form", label: "Contact Form", description: "Simple enquiry form", aiReady: true },
  { type: "whatsapp", label: "WhatsApp Button", description: "Chat on WhatsApp", aiReady: true },
  { type: "booking", label: "Booking", description: "Book appointments", aiReady: true },
  { type: "services", label: "Services", description: "List what you offer", aiReady: true },
  { type: "pricing", label: "Pricing", description: "Packages and prices", aiReady: true },
  { type: "testimonials", label: "Testimonials", description: "Social proof quotes", aiReady: true },
  { type: "faq", label: "FAQ", description: "Common questions", aiReady: true },
  { type: "newsletter", label: "Newsletter", description: "Email signup", aiReady: true },
  { type: "map", label: "Map", description: "Location / Google Maps", aiReady: true },
  { type: "store_links", label: "Store Links", description: "Shop products", aiReady: true },
  { type: "donation", label: "Donation", description: "Support / tip jar", aiReady: true },
  { type: "events", label: "Events", description: "Upcoming dates", aiReady: true },
  { type: "custom_html", label: "Custom HTML", description: "Embed custom code", aiReady: false },
]

export function createSection(type: SectionType, content?: Record<string, unknown>): PageSection {
  const def = SECTION_CATALOG.find((s) => s.type === type)
  return {
    id: `${type}-${typeof crypto !== "undefined" ? crypto.randomUUID().slice(0, 8) : Date.now()}`,
    type,
    title: def?.label ?? type,
    collapsed: false,
    content: content ?? defaultSectionContent(type),
  }
}

export function defaultSectionContent(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "about":
      return { body: "Tell visitors who you are and what you do." }
    case "testimonials":
      return {
        items: [
          { quote: "Amazing work — highly recommend!", author: "Happy Client" },
          { quote: "Professional, fast, and creative.", author: "Local Business" },
        ],
      }
    case "services":
      return {
        items: [
          { title: "Service One", description: "Describe your offering" },
          { title: "Service Two", description: "Describe your offering" },
        ],
      }
    case "pricing":
      return {
        items: [
          { title: "Starter", price: "R299", description: "Perfect to get started" },
          { title: "Pro", price: "R599", description: "Most popular package" },
        ],
      }
    case "faq":
      return {
        items: [
          { q: "How do I book?", a: "Tap WhatsApp or the booking button above." },
          { q: "Where are you based?", a: "South Africa — serving clients nationwide." },
        ],
      }
    case "booking":
      return { cta: "Book a session", url: "https://wa.me/27" }
    case "whatsapp":
      return { cta: "Chat on WhatsApp", url: "https://wa.me/27" }
    case "gallery":
      return { images: [] }
    case "video":
      return { url: "", title: "Watch my latest video" }
    case "music_embed":
      return { url: "https://open.spotify.com", title: "Listen now" }
    case "newsletter":
      return { headline: "Join my newsletter", placeholder: "your@email.com" }
    case "map":
      return { label: "Find us", url: "https://maps.google.com/" }
    case "donation":
      return { cta: "Support my work", url: "" }
    case "events":
      return {
        items: [{ title: "Upcoming event", date: "TBA", location: "South Africa" }],
      }
    case "store_links":
      return { items: [{ title: "Shop now", url: "" }] }
    case "contact_form":
      return { headline: "Get in touch" }
    case "custom_html":
      return { html: "" }
    default:
      return {}
  }
}

export const BLANK_CANVAS_SECTIONS: PageSection[] = [
  createSection("profile"),
  createSection("links"),
]

export const BLANK_TEMPLATE_ID = "blank"

export function normalizePageSections(raw: unknown): PageSection[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      const r = item as PageSection
      if (!r?.type || !r?.id) return null
      return {
        id: String(r.id),
        type: r.type as SectionType,
        title: r.title ? String(r.title) : undefined,
        collapsed: !!r.collapsed,
        content: (r.content as Record<string, unknown>) ?? {},
      }
    })
    .filter(Boolean) as PageSection[]
}

const LEGACY_SECTION_MAP: Record<string, SectionType> = {
  socials: "social_icons",
  contact: "whatsapp",
  projects: "gallery",
  spotify_embed: "music_embed",
}

export function pageSectionsFromDocument(doc: {
  sections: string[]
  page_sections?: PageSection[]
}): PageSection[] {
  if (doc.page_sections?.length) return doc.page_sections
  return doc.sections.map((s) => {
    const type = (LEGACY_SECTION_MAP[s] ?? s) as SectionType
    return createSection(type)
  })
}

export function sectionsToLegacyIds(pageSections: PageSection[]): string[] {
  return pageSections.map((s) => s.type)
}

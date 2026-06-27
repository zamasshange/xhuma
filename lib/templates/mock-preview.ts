import type { TemplateDocument } from "@/lib/editor-state"
import type { PageSection } from "@/lib/editor-sections"

/** Unsplash portraits — stable crop URLs for template thumbnails */
const AVATARS = {
  woman1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face",
  woman2: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&h=240&fit=crop&crop=face",
  woman3: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=240&h=240&fit=crop&crop=face",
  man1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face",
  man2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face",
  man3: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face",
  dj: "https://images.unsplash.com/photo-1571266028247-e4733b0f0bb0?w=240&h=240&fit=crop&crop=face",
  chef: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=240&h=240&fit=crop&crop=face",
  barber: "https://images.unsplash.com/photo-1622286342621-4bd7861f8d7e?w=240&h=240&fit=crop&crop=face",
  artist: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face",
  fitness: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=240&h=240&fit=crop&crop=face",
  pastor: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=face",
  student: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&h=240&fit=crop&crop=face",
  luxury: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=240&h=240&fit=crop&crop=face",
} as const

type MockLink = { title: string; url: string; icon: string }

export type VariantMockPreview = {
  profile: {
    display_name: string
    bio: string
    avatar_url: string
  }
  links: MockLink[]
  page_sections?: PageSection[]
}

export const VARIANT_MOCK_PREVIEWS: Record<string, VariantMockPreview> = {
  creator: {
    profile: {
      display_name: "Thandi Nkosi",
      bio: "Content creator · Cape Town 🇿🇦",
      avatar_url: AVATARS.woman1,
    },
    links: [
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "YouTube", url: "#", icon: "youtube" },
      { title: "Join my newsletter", url: "#", icon: "link" },
    ],
  },
  influencer: {
    profile: {
      display_name: "Zanele Mthembu",
      bio: "Lifestyle · brand collabs · Jozi",
      avatar_url: AVATARS.woman2,
    },
    links: [
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "TikTok", url: "#", icon: "tiktok" },
      { title: "Work with me", url: "#", icon: "link" },
    ],
  },
  musician: {
    profile: {
      display_name: "DJ Kairo",
      bio: "Amapiano · live sets · SA tours",
      avatar_url: AVATARS.dj,
    },
    links: [
      { title: "Listen on Spotify", url: "#", icon: "spotify" },
      { title: "Apple Music", url: "#", icon: "link" },
      { title: "Tour dates", url: "#", icon: "link" },
    ],
    page_sections: [
      { id: "profile", type: "profile", content: {} },
      { id: "links", type: "links", content: {} },
      {
        id: "music-1",
        type: "music_embed",
        title: "Music Embed",
        content: { platform: "spotify", url: "https://open.spotify.com" },
      },
    ],
  },
  artist: {
    profile: {
      display_name: "Lerato Khumalo",
      bio: "Digital artist · commissions open",
      avatar_url: AVATARS.artist,
    },
    links: [
      { title: "View portfolio", url: "#", icon: "website" },
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "Commission me", url: "#", icon: "link" },
    ],
  },
  photographer: {
    profile: {
      display_name: "Sipho Ndlovu",
      bio: "Wedding & portrait · Durban",
      avatar_url: AVATARS.man2,
    },
    links: [
      { title: "Book a shoot", url: "#", icon: "link" },
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "WhatsApp", url: "#", icon: "whatsapp" },
    ],
  },
  videographer: {
    profile: {
      display_name: "Anele Dlamini",
      bio: "Filmmaker · reels & brand films",
      avatar_url: AVATARS.man1,
    },
    links: [
      { title: "YouTube", url: "#", icon: "youtube" },
      { title: "Showreel", url: "#", icon: "link" },
      { title: "Hire me", url: "#", icon: "link" },
    ],
  },
  developer: {
    profile: {
      display_name: "Kagiso Molefe",
      bio: "Full-stack dev · open source",
      avatar_url: AVATARS.man3,
    },
    links: [
      { title: "GitHub", url: "#", icon: "link" },
      { title: "Portfolio", url: "#", icon: "website" },
      { title: "LinkedIn", url: "#", icon: "linkedin" },
    ],
  },
  designer: {
    profile: {
      display_name: "Nomsa Pillay",
      bio: "UI/UX designer · product & brand",
      avatar_url: AVATARS.woman3,
    },
    links: [
      { title: "Dribbble", url: "#", icon: "link" },
      { title: "Case studies", url: "#", icon: "website" },
      { title: "Contact", url: "#", icon: "link" },
    ],
  },
  portfolio: {
    profile: {
      display_name: "Chris van Wyk",
      bio: "Creative director · Cape Town",
      avatar_url: AVATARS.man2,
    },
    links: [
      { title: "View projects", url: "#", icon: "website" },
      { title: "Hire me", url: "#", icon: "link" },
      { title: "Email", url: "#", icon: "link" },
    ],
  },
  business: {
    profile: {
      display_name: "Ubuntu Digital",
      bio: "Marketing agency · Johannesburg",
      avatar_url: AVATARS.man1,
    },
    links: [
      { title: "Book a consultation", url: "#", icon: "link" },
      { title: "WhatsApp us", url: "#", icon: "whatsapp" },
      { title: "Our services", url: "#", icon: "website" },
    ],
  },
  restaurant: {
    profile: {
      display_name: "Mama's Kitchen",
      bio: "Soul food · Maboneng · Jozi",
      avatar_url: AVATARS.chef,
    },
    links: [
      { title: "View menu", url: "#", icon: "link" },
      { title: "Reserve a table", url: "#", icon: "link" },
      { title: "WhatsApp orders", url: "#", icon: "whatsapp" },
    ],
  },
  "beauty-salon": {
    profile: {
      display_name: "Glow Studio",
      bio: "Nails, lashes & beauty · Sandton",
      avatar_url: AVATARS.woman2,
    },
    links: [
      { title: "Book appointment", url: "#", icon: "link" },
      { title: "Price list", url: "#", icon: "link" },
      { title: "Instagram", url: "#", icon: "instagram" },
    ],
  },
  barber: {
    profile: {
      display_name: "The Fade Room",
      bio: "Premium cuts · walk-ins welcome",
      avatar_url: AVATARS.barber,
    },
    links: [
      { title: "Book on WhatsApp", url: "#", icon: "whatsapp" },
      { title: "Price list", url: "#", icon: "link" },
      { title: "Find us", url: "#", icon: "link" },
    ],
  },
  "makeup-artist": {
    profile: {
      display_name: "Amahle Beauty",
      bio: "Bridal & glam · Cape Town",
      avatar_url: AVATARS.woman1,
    },
    links: [
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "Bridal packages", url: "#", icon: "link" },
      { title: "Book a trial", url: "#", icon: "link" },
    ],
  },
  "real-estate": {
    profile: {
      display_name: "Lindiwe Properties",
      bio: "Homes & investments · Gauteng",
      avatar_url: AVATARS.woman3,
    },
    links: [
      { title: "View listings", url: "#", icon: "website" },
      { title: "WhatsApp agent", url: "#", icon: "whatsapp" },
      { title: "Schedule viewing", url: "#", icon: "link" },
    ],
  },
  church: {
    profile: {
      display_name: "Grace Community",
      bio: "Sunday service · midweek prayer",
      avatar_url: AVATARS.pastor,
    },
    links: [
      { title: "Watch sermons", url: "#", icon: "youtube" },
      { title: "Give online", url: "#", icon: "link" },
      { title: "Events", url: "#", icon: "link" },
    ],
  },
  podcast: {
    profile: {
      display_name: "The SA Creator Pod",
      bio: "Stories from African creators",
      avatar_url: AVATARS.man3,
    },
    links: [
      { title: "Spotify", url: "#", icon: "spotify" },
      { title: "Apple Podcasts", url: "#", icon: "link" },
      { title: "Latest episode", url: "#", icon: "link" },
    ],
  },
  streamer: {
    profile: {
      display_name: "PixelNomad",
      bio: "Twitch · gaming & chill",
      avatar_url: AVATARS.dj,
    },
    links: [
      { title: "Twitch", url: "#", icon: "link" },
      { title: "YouTube", url: "#", icon: "youtube" },
      { title: "Tip jar", url: "#", icon: "link" },
    ],
  },
  student: {
    profile: {
      display_name: "Jordan Pretorius",
      bio: "CS student · UCT · open to internships",
      avatar_url: AVATARS.student,
    },
    links: [
      { title: "CV / Resume", url: "#", icon: "link" },
      { title: "GitHub", url: "#", icon: "link" },
      { title: "LinkedIn", url: "#", icon: "linkedin" },
    ],
  },
  freelancer: {
    profile: {
      display_name: "Mandla Zulu",
      bio: "Freelance writer & strategist",
      avatar_url: AVATARS.man2,
    },
    links: [
      { title: "Hire me", url: "#", icon: "link" },
      { title: "Portfolio", url: "#", icon: "website" },
      { title: "Email", url: "#", icon: "link" },
    ],
  },
  agency: {
    profile: {
      display_name: "Pulse Creative",
      bio: "Brand, web & social for SA businesses",
      avatar_url: AVATARS.woman3,
    },
    links: [
      { title: "Our work", url: "#", icon: "website" },
      { title: "Get a quote", url: "#", icon: "link" },
      { title: "WhatsApp", url: "#", icon: "whatsapp" },
    ],
  },
  "online-store": {
    profile: {
      display_name: "Zazi Shop",
      bio: "Handmade jewellery · ships nationwide",
      avatar_url: AVATARS.woman2,
    },
    links: [
      { title: "Shop now", url: "#", icon: "website" },
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "WhatsApp orders", url: "#", icon: "whatsapp" },
    ],
  },
  "fitness-coach": {
    profile: {
      display_name: "Coach Thabo",
      bio: "Strength & conditioning · online programs",
      avatar_url: AVATARS.fitness,
    },
    links: [
      { title: "Book a session", url: "#", icon: "link" },
      { title: "Programs", url: "#", icon: "link" },
      { title: "Instagram", url: "#", icon: "instagram" },
    ],
  },
  "personal-brand": {
    profile: {
      display_name: "Kai Mokoena",
      bio: "Speaker · author · one link for everything",
      avatar_url: AVATARS.man1,
    },
    links: [
      { title: "My website", url: "#", icon: "website" },
      { title: "Book me to speak", url: "#", icon: "link" },
      { title: "Newsletter", url: "#", icon: "link" },
    ],
  },
  minimal: {
    profile: {
      display_name: "Alex Reid",
      bio: "Simple links. No noise.",
      avatar_url: AVATARS.man3,
    },
    links: [
      { title: "Website", url: "#", icon: "website" },
      { title: "Email me", url: "#", icon: "link" },
    ],
  },
  luxury: {
    profile: {
      display_name: "Élise Laurent",
      bio: "Luxury lifestyle · private clients",
      avatar_url: AVATARS.luxury,
    },
    links: [
      { title: "Enquiries", url: "#", icon: "link" },
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "Portfolio", url: "#", icon: "website" },
    ],
  },
  dark: {
    profile: {
      display_name: "NOIR COLLECTIVE",
      bio: "Underground sounds · late nights",
      avatar_url: AVATARS.dj,
    },
    links: [
      { title: "Spotify", url: "#", icon: "spotify" },
      { title: "SoundCloud", url: "#", icon: "link" },
      { title: "Events", url: "#", icon: "link" },
    ],
  },
  colorful: {
    profile: {
      display_name: "Sunshine Studio",
      bio: "Art, colour & good vibes ✨",
      avatar_url: AVATARS.woman1,
    },
    links: [
      { title: "Instagram", url: "#", icon: "instagram" },
      { title: "Shop prints", url: "#", icon: "link" },
      { title: "YouTube", url: "#", icon: "youtube" },
    ],
  },
}

export function getVariantMockPreview(variantId: string): VariantMockPreview | null {
  return VARIANT_MOCK_PREVIEWS[variantId] ?? null
}

/** Merge showcase mock content into a base template document (for marketplace previews & starters). */
export function applyVariantMockToDocument(
  base: TemplateDocument,
  variantId: string,
): TemplateDocument {
  const mock = getVariantMockPreview(variantId)
  if (!mock) {
    return { ...base, layout: variantId }
  }

  return {
    ...base,
    layout: variantId,
    profile: {
      ...base.profile,
      display_name: mock.profile.display_name,
      bio: mock.profile.bio,
      avatar_url: mock.profile.avatar_url,
    },
    links: mock.links.map((l, i) => ({
      id: `link-${i}`,
      title: l.title,
      url: l.url,
      icon: l.icon,
      position: i,
      is_active: true,
    })),
    ...(mock.page_sections ? { page_sections: mock.page_sections } : {}),
  }
}

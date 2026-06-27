import type { TemplateDocument } from "@/lib/editor-state"
import type { PageSection } from "@/lib/editor-sections"
import type { LinkCardStyle } from "@/lib/link-card-styles"
import { getThemePreset } from "@/lib/theme-presets"
import { BIO_ASSETS } from "@/data/bio-link"

/** Reliable CDN portraits for template thumbnails */
const AVATARS = {
  woman1: `${BIO_ASSETS}/user1.Ba8DzGMp.png`,
  woman2: `${BIO_ASSETS}/user3.w1PRNQjx.png`,
  woman3: `${BIO_ASSETS}/user7.BJbxwnbs.png`,
  man1: `${BIO_ASSETS}/user6.BtYp0XeA.png`,
  man2: `${BIO_ASSETS}/user2.CiMA-Ti0.png`,
  man3: `${BIO_ASSETS}/user12.ZeT4kErD.png`,
  dj: `${BIO_ASSETS}/user2.CiMA-Ti0.png`,
  chef: `${BIO_ASSETS}/user11.R_TCStqE.png`,
  barber: `${BIO_ASSETS}/user4.Bo0FbbWl.png`,
  artist: `${BIO_ASSETS}/user9.BTGRzHLW.png`,
  fitness: `${BIO_ASSETS}/user13.CkAwBvvN.png`,
  pastor: `${BIO_ASSETS}/user10.Dzm4B_2D.png`,
  student: `${BIO_ASSETS}/user8.C6dud4fg.png`,
  luxury: `${BIO_ASSETS}/user5.CwX5k9hm.png`,
} as const

/** Unique theme + link style per marketplace variant */
const VARIANT_THEMES: Record<string, { presetId: string; link_style?: LinkCardStyle }> = {
  creator: { presetId: "summer", link_style: "wavy" },
  influencer: { presetId: "strawberry", link_style: "pill" },
  musician: { presetId: "retro", link_style: "pill" },
  artist: { presetId: "chameleon", link_style: "soft" },
  photographer: { presetId: "desert", link_style: "rounded" },
  videographer: { presetId: "carbon", link_style: "neon" },
  developer: { presetId: "minimal", link_style: "square" },
  designer: { presetId: "pride", link_style: "glass" },
  portfolio: { presetId: "neon", link_style: "outline" },
  business: { presetId: "basic", link_style: "rounded" },
  restaurant: { presetId: "desert", link_style: "soft" },
  "beauty-salon": { presetId: "strawberry", link_style: "pill" },
  barber: { presetId: "carbon", link_style: "comic" },
  "makeup-artist": { presetId: "summer", link_style: "glass" },
  "real-estate": { presetId: "basic", link_style: "outline" },
  church: { presetId: "rainy", link_style: "pill" },
  podcast: { presetId: "xmas", link_style: "rounded" },
  streamer: { presetId: "neon", link_style: "neon" },
  student: { presetId: "minimal", link_style: "outline" },
  freelancer: { presetId: "retro", link_style: "rounded" },
  agency: { presetId: "carbon", link_style: "glass" },
  "online-store": { presetId: "pride", link_style: "pill" },
  "fitness-coach": { presetId: "summer", link_style: "comic" },
  "personal-brand": { presetId: "chameleon", link_style: "rounded" },
  minimal: { presetId: "rainy", link_style: "pill" },
  luxury: { presetId: "carbon", link_style: "outline" },
  dark: { presetId: "rainy", link_style: "neon" },
  colorful: { presetId: "strawberry", link_style: "wavy" },
}

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
    ...(VARIANT_THEMES[variantId]
      ? {
          theme: {
            ...(getThemePreset(VARIANT_THEMES[variantId].presetId)?.theme ?? base.theme),
            link_style: VARIANT_THEMES[variantId].link_style,
          },
        }
      : {}),
  }
}

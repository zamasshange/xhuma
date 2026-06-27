import type { ProfileTheme } from "@/lib/database.types"
import type { TemplateDocument } from "@/lib/editor-state"
import { getThemePreset, themeWithBackground } from "@/lib/theme-presets"

function tplTheme(presetId: string, fallback: ProfileTheme): ProfileTheme {
  const preset = getThemePreset(presetId)
  return preset?.theme ?? themeWithBackground(fallback, preset?.image)
}

export type Template = {
  id: string
  name: string
  description: string
  preview_image: string | null
  default_data: TemplateDocument
}

export const TEMPLATE_IDS = ["creator", "business", "musician", "portfolio", "minimal"] as const
export type TemplateId = (typeof TEMPLATE_IDS)[number]

export function isTemplateId(id: string): id is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(id)
}

export const STATIC_TEMPLATES: Template[] = [
  {
    id: "creator",
    name: "Creator",
    description: "Big profile, social links, and video-ready layout",
    preview_image: "https://bio.link/_nuxt/summer._wbdH2hK.png",
    default_data: {
      layout: "creator",
      sections: ["profile", "links", "socials"],
      theme: tplTheme("summer", { bg: "#38bdf8", text: "#ffffff", button: "#facc15", button_text: "#0d0c22", radius: "0", button_style: "wavy" }),
      profile: { display_name: "", bio: "", avatar_url: null },
      links: [
        { title: "Instagram", url: "", icon: "instagram" },
        { title: "YouTube", url: "", icon: "youtube" },
        { title: "Join my newsletter", url: "", icon: "link" },
      ],
    },
  },
  {
    id: "business",
    name: "Business",
    description: "CTA buttons, WhatsApp, and services focus",
    preview_image: "https://bio.link/_nuxt/basic.DuPDlgvB.png",
    default_data: {
      layout: "business",
      sections: ["profile", "services", "links", "contact"],
      theme: tplTheme("basic", { bg: "#ffffff", text: "#111111", button: "#000000", button_text: "#ffffff", radius: "14px" }),
      profile: { display_name: "", bio: "", avatar_url: null },
      links: [
        { title: "Book a consultation", url: "", icon: "link" },
        { title: "WhatsApp us", url: "https://wa.me/", icon: "whatsapp" },
        { title: "Our services", url: "", icon: "website" },
      ],
    },
  },
  {
    id: "musician",
    name: "Musician",
    description: "Spotify embed style and streaming links",
    preview_image: "https://bio.link/_nuxt/retro.tmNX0151.png",
    default_data: {
      layout: "music",
      sections: ["profile", "spotify_embed", "links"],
      theme: tplTheme("retro", { bg: "#050505", text: "#ffffff", button: "#ff0055", button_text: "#ffffff", radius: "999px", button_style: "pill" }),
      profile: { display_name: "", bio: "", avatar_url: null },
      links: [
        { title: "Listen on Spotify", url: "https://open.spotify.com", icon: "spotify" },
        { title: "Apple Music", url: "", icon: "link" },
        { title: "Tour dates", url: "", icon: "link" },
      ],
    },
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Projects grid and contact button",
    preview_image: "https://bio.link/_nuxt/chameleon.C-GjyGpf.png",
    default_data: {
      layout: "portfolio",
      sections: ["profile", "projects", "links"],
      theme: tplTheme("chameleon", { bg: "#faf5ff", text: "#4c1d95", button: "#7c3aed", button_text: "#ffffff", radius: "12px" }),
      profile: { display_name: "", bio: "", avatar_url: null },
      links: [
        { title: "View projects", url: "", icon: "website" },
        { title: "Hire me", url: "", icon: "link" },
        { title: "Contact", url: "mailto:hello@example.com", icon: "link" },
      ],
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean links only — nothing extra",
    preview_image: "https://bio.link/_nuxt/rainy-night.fNTxc-2o.png",
    default_data: {
      layout: "minimal",
      sections: ["profile", "links"],
      theme: tplTheme("rainy", {
        bg: "#f4f4f4",
        text: "#0d0c22",
        button: "#0d0c22",
        button_text: "#ffffff",
        radius: "999px",
        button_style: "pill",
      }),
      profile: { display_name: "", bio: "", avatar_url: null },
      links: [
        { title: "Website", url: "", icon: "website" },
        { title: "Email me", url: "mailto:hello@example.com", icon: "link" },
      ],
    },
  },
]

export function getStaticTemplate(id: string): Template | undefined {
  return STATIC_TEMPLATES.find((t) => t.id === id)
}

/** @deprecated use TemplateDocument merge in editor-state */
export type ProfileDraftData = TemplateDocument & { theme: ProfileTheme }

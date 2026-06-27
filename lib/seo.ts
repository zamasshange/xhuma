import type { Metadata } from "next"
import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/brand"
import { DEFAULT_LOCALE } from "@/lib/locale"
import { SEO_KEYWORDS_ALL } from "@/lib/seo-keywords"

export const SEO_DEFAULT_DESCRIPTION =
  "Create a beautiful AI-powered link in bio page with Xhuma. Share Instagram, TikTok, YouTube, WhatsApp, portfolio, music and more from one smart link. Built for creators in South Africa, Africa, and beyond."

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
}

export const INDEX_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
}

/** Build absolute URL from a site path */
export function absoluteUrl(path = "/"): string {
  const base = SITE_URL.replace(/\/$/, "")
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

type BuildMetadataOptions = {
  title: string
  description?: string
  path?: string
  image?: string | null
  noIndex?: boolean
  type?: "website" | "article" | "profile"
  publishedTime?: string
  authors?: string[]
  keywords?: string[]
  /** Use full title as-is (no template suffix) */
  absoluteTitle?: boolean
}

export function buildMetadata({
  title,
  description = SEO_DEFAULT_DESCRIPTION,
  path = "/",
  image,
  noIndex = false,
  type = "website",
  publishedTime,
  authors,
  keywords = [...SEO_KEYWORDS_ALL].slice(0, 32),
  absoluteTitle = false,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image")

  const fullTitle =
    absoluteTitle || path === "/" || title.includes("Xhuma")
      ? title
      : `${title} | ${SITE_NAME}`

  const openGraph: Metadata["openGraph"] = {
    type,
    locale: DEFAULT_LOCALE.replace("-", "_"),
    url,
    siteName: SITE_NAME,
    title: fullTitle,
    description,
    images: [{ url: imageUrl, width: 1200, height: 630, alt: `${fullTitle} — ${SITE_NAME}` }],
    ...(type === "article" && publishedTime ? { publishedTime, authors } : {}),
  }

  return {
    title: absoluteTitle || path === "/" ? { absolute: fullTitle } : fullTitle,
    description: description.slice(0, 160),
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? NOINDEX_ROBOTS : INDEX_ROBOTS,
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: "@xhumacc",
      title: fullTitle,
      description: description.slice(0, 160),
      images: [imageUrl],
    },
  }
}

/** Root layout defaults */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Xhuma – AI Link in Bio Platform for Creators",
    template: "%s | Xhuma",
  },
  description: SEO_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "BDL Corp", url: SITE_URL }],
  creator: "BDL Corp",
  publisher: SITE_NAME,
  keywords: [...SEO_KEYWORDS_ALL].slice(0, 32),
  alternates: { canonical: absoluteUrl("/") },
  robots: INDEX_ROBOTS,
  openGraph: {
    type: "website",
    locale: DEFAULT_LOCALE.replace("-", "_"),
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: "Xhuma – AI Link in Bio Platform for Creators",
    description: SEO_DEFAULT_DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Xhuma — AI link in bio platform" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xhumacc",
    title: "Xhuma – AI Link in Bio Platform for Creators",
    description: SEO_DEFAULT_DESCRIPTION,
    images: [absoluteUrl("/opengraph-image")],
  },
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  category: "technology",
}

export const marketingPages = {
  home: {
    title: "Xhuma – AI Link in Bio Platform",
    description:
      "Xhuma is the AI link in bio platform for creators and businesses. Build a beautiful page for Instagram, TikTok, YouTube, WhatsApp and more — free to start.",
    path: "/",
    absoluteTitle: true,
  },
  features: {
    title: "AI Features for Creators",
    description:
      "AI Studio, smart themes, analytics, and mobile-first link in bio pages. Everything creators need to grow on Xhuma — built for South Africa and beyond.",
    path: "/features",
  },
  templates: {
    title: "Link in Bio Templates",
    description:
      "Choose from beautiful link in bio templates on Xhuma. Creator, musician, business, and portfolio layouts — customise with AI in minutes.",
    path: "/templates",
  },
  pricing: {
    title: "Affordable Link in Bio Plans",
    description:
      "Start free on Xhuma. Creator, Pro, and Business plans in ZAR with AI tools, custom domains, and analytics for South African creators.",
    path: "/pricing",
  },
  about: {
    title: "About Xhuma",
    description:
      "Xhuma by BDL Corp helps creators and businesses own their audience with AI-powered link in bio pages — built for South Africa and Africa.",
    path: "/about",
  },
  contact: {
    title: "Contact Xhuma",
    description:
      "Get in touch with the Xhuma team. Questions about your link in bio, AI features, pricing, or partnerships — we're here to help creators.",
    path: "/contact",
  },
  explore: {
    title: "Explore Creator Pages",
    description:
      "Discover link in bio pages built by creators on Xhuma. Browse live profiles from South Africa, Africa, and around the world.",
    path: "/explore",
  },
  blog: {
    title: "Creator Blog & Guides",
    description:
      "Link in bio tips, Instagram growth, TikTok strategy, and AI productivity for creators. Insights from the Xhuma team and community.",
    path: "/blog",
  },
  faq: {
    title: "FAQ — Link in Bio Help",
    description:
      "Answers about Xhuma — AI link in bio, pricing in ZAR, custom domains, WhatsApp links, and getting started as a South African creator.",
    path: "/faq",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Xhuma collects, uses, and protects your personal information. POPIA-aware privacy practices for creators and businesses in South Africa.",
    path: "/privacy",
  },
  terms: {
    title: "Terms of Service",
    description:
      "Terms and conditions for using the Xhuma AI link in bio platform. Your rights, responsibilities, and acceptable use policy.",
    path: "/terms",
  },
} as const

export function pageMetadata(key: keyof typeof marketingPages): Metadata {
  const page = marketingPages[key]
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    absoluteTitle: "absoluteTitle" in page ? page.absoluteTitle : false,
  })
}

export function profileMetadata({
  displayName,
  username,
  bio,
  avatarUrl,
}: {
  displayName: string
  username: string
  bio?: string | null
  avatarUrl?: string | null
}): Metadata {
  const title = `${displayName} (@${username}) | Xhuma`
  const description =
    bio?.trim().slice(0, 155) ||
    `Visit ${displayName}'s AI-powered link in bio on Xhuma. Social links, WhatsApp, portfolio, music and more — one smart page for creators.`

  return buildMetadata({
    title,
    description,
    path: `/${username}`,
    image: avatarUrl,
    type: "profile",
    absoluteTitle: true,
    keywords: [
      displayName,
      username,
      "link in bio",
      "Xhuma profile",
      "creator page",
      `${displayName} links`,
    ],
  })
}

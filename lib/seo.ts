import type { Metadata } from "next"
import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/brand"
import { DEFAULT_LOCALE } from "@/lib/locale"

export const SEO_KEYWORDS = [
  "link in bio",
  "link in bio tool",
  "AI link in bio",
  "creator link page",
  "bio link",
  "social media landing page",
  "linktree alternative",
  "xhuma",
  "link in bio South Africa",
  "South African creators",
] as const

export const SEO_DEFAULT_DESCRIPTION =
  "Xhuma is the AI-powered link in bio platform built for South African creators and businesses. Build a beautiful, high-converting page in minutes. Free to start."

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
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
  /** Absolute or site-relative image URL */
  image?: string | null
  noIndex?: boolean
  type?: "website" | "article" | "profile"
  publishedTime?: string
  authors?: string[]
  keywords?: string[]
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
  keywords = [...SEO_KEYWORDS],
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image")

  const fullTitle =
    path === "/" || title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  const useAbsoluteTitle = path === "/" || title.includes(SITE_NAME)

  const openGraph: Metadata["openGraph"] = {
    type,
    locale: DEFAULT_LOCALE.replace("-", "_"),
    url,
    siteName: SITE_NAME,
    title: fullTitle,
    description,
    images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
    ...(type === "article" && publishedTime ? { publishedTime, authors } : {}),
  }

  return {
    title: useAbsoluteTitle ? { absolute: fullTitle } : title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? NOINDEX_ROBOTS : { index: true, follow: true },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  }
}

/** Root layout defaults */
export const rootMetadata: Metadata = {
  ...buildMetadata({
    title: `${SITE_NAME} — Your Entire Online Presence, Powered by AI`,
    description: SEO_DEFAULT_DESCRIPTION,
    path: "/",
  }),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    title: `${SITE_NAME} — Your Entire Online Presence, Powered by AI`,
    description: SEO_DEFAULT_DESCRIPTION,
    path: "/",
  },
  features: {
    title: "Features",
    description:
      "AI Studio, premium themes, analytics, and mobile-first link in bio pages — everything creators need on Xhuma.",
    path: "/features",
  },
  pricing: {
    title: "Pricing",
    description:
      "Start free on Xhuma. Upgrade to Pro for AI tools, custom domains, and advanced analytics.",
    path: "/pricing",
  },
  about: {
    title: "About",
    description:
      "Xhuma helps creators own their audience with beautiful, AI-powered link in bio pages.",
    path: "/about",
  },
  contact: {
    title: "Contact",
    description: "Get in touch with the Xhuma team — we're here to help creators grow.",
    path: "/contact",
  },
  explore: {
    title: "Explore Creators",
    description: `Discover link in bio pages built by creators on ${SITE_DOMAIN}.`,
    path: "/explore",
  },
  blog: {
    title: "Blog",
    description: "Tips, trends, and strategies to grow your audience with your link in bio.",
    path: "/blog",
  },
  faq: {
    title: "FAQ",
    description: "Answers to common questions about Xhuma — AI link in bio, pricing, and domains.",
    path: "/faq",
  },
  privacy: {
    title: "Privacy Policy",
    description: `How ${SITE_NAME} collects, uses, and protects your personal information.`,
    path: "/privacy",
  },
  terms: {
    title: "Terms of Service",
    description: `Terms and conditions for using the ${SITE_NAME} link-in-bio platform.`,
    path: "/terms",
  },
} as const

export function pageMetadata(key: keyof typeof marketingPages): Metadata {
  const page = marketingPages[key]
  return buildMetadata(page)
}

import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { blogPosts } from "@/data/marketing"
import { absoluteUrl, marketingPages } from "@/lib/seo"

const STATIC_PATHS = [
  marketingPages.home.path,
  marketingPages.features.path,
  marketingPages.templates.path,
  marketingPages.pricing.path,
  marketingPages.about.path,
  marketingPages.contact.path,
  marketingPages.explore.path,
  marketingPages.blog.path,
  marketingPages.faq.path,
  marketingPages.privacy.path,
  marketingPages.terms.path,
  "/sign-in",
  "/sign-up",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/blog" || path === "/features" ? 0.9 : 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  let profileEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("profiles")
      .select("username, created_at")
      .order("created_at", { ascending: false })
      .limit(5000)

    profileEntries = (data ?? []).map((profile) => ({
      url: absoluteUrl(`/${profile.username}`),
      lastModified: profile.created_at ? new Date(profile.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  } catch {
    // Sitemap still works without profile URLs if Supabase is unavailable at build time
  }

  return [...staticEntries, ...blogEntries, ...profileEntries]
}

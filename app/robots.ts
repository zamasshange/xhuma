import type { MetadataRoute } from "next"
import { buildAbsoluteUrl, getRequestSiteUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getRequestSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/editor",
          "/editor/",
          "/onboarding",
          "/onboarding/",
          "/claim",
          "/claim/",
          "/create",
          "/create/",
          "/auth/",
          "/api/",
          "/login",
          "/signup",
          "/settings",
          "/admin",
        ],
      },
    ],
    sitemap: buildAbsoluteUrl(siteUrl, "/sitemap.xml"),
    host: siteUrl.replace(/^https?:\/\//, ""),
  }
}

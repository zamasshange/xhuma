import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/brand"
import { absoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/editor",
          "/onboarding",
          "/claim",
          "/create",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL.replace(/^https?:\/\//, ""),
  }
}

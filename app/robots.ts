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
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL.replace(/^https?:\/\//, ""),
  }
}

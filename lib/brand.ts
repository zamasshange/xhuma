import { getSiteUrl, PRODUCTION_SITE_URL, SITE_DOMAIN, buildAbsoluteUrl, getRequestSiteUrl } from "@/lib/site-url"

export const SITE_NAME = "Xhuma"
/** @deprecated Import SITE_DOMAIN from @/lib/site-url */
export { SITE_DOMAIN, PRODUCTION_SITE_URL, getSiteUrl, getRequestSiteUrl, buildAbsoluteUrl }
/** Public site origin — prefer getRequestSiteUrl() in sitemap/robots */
export const SITE_URL = getSiteUrl()

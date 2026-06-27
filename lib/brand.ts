export const SITE_NAME = "Xhuma"
export const SITE_DOMAIN = "xhuma.cc"
/** Vercel redirects apex → www; keep in sync with NEXT_PUBLIC_SITE_URL */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://www.${SITE_DOMAIN}`

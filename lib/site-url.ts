/** Canonical production origin */
export const PRODUCTION_SITE_URL = "https://xhuma.cc"
export const SITE_DOMAIN = "xhuma.cc"

function normalizeOrigin(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "")
  if (!trimmed.startsWith("http")) return `https://${trimmed}`
  return trimmed
}

function isLocalhost(url: string): boolean {
  try {
    const { hostname } = new URL(normalizeOrigin(url))
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".local")
    )
  } catch {
    return true
  }
}

function isXhumaHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return h === SITE_DOMAIN || h === `www.${SITE_DOMAIN}` || h.endsWith(`.${SITE_DOMAIN}`)
}

/** Build an absolute URL from a known origin + path */
export function buildAbsoluteUrl(origin: string, path = "/"): string {
  const base = origin.replace(/\/$/, "")
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Resolve site origin from the incoming request (most reliable for sitemap/robots).
 * When Google fetches https://xhuma.cc/sitemap.xml, URLs use https://xhuma.cc.
 */
export async function getRequestSiteUrl(): Promise<string> {
  try {
    const { headers } = await import("next/headers")
    const h = await headers()
    const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() ?? h.get("host")?.trim()
    if (host && !isLocalhost(`https://${host}`)) {
      const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https"
      return normalizeOrigin(`${proto}://${host}`)
    }
  } catch {
    // headers() not available outside a request
  }
  return getSiteUrl()
}

/**
 * Resolve the public site origin for SEO.
 * Prefers server-only SITE_URL, then request-safe Vercel vars — never localhost on Vercel.
 */
export function getSiteUrl(): string {
  // Server-only — not inlined at build like NEXT_PUBLIC_*
  const serverUrl = process.env.SITE_URL?.trim()
  if (serverUrl && !isLocalhost(serverUrl)) return normalizeOrigin(serverUrl)

  const onVercel = Boolean(process.env.VERCEL)

  if (onVercel) {
    const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    if (publicUrl && !isLocalhost(publicUrl) && isXhumaHost(new URL(normalizeOrigin(publicUrl)).hostname)) {
      return normalizeOrigin(publicUrl)
    }

    const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
    if (vercelProduction && !isLocalhost(vercelProduction)) {
      return normalizeOrigin(vercelProduction)
    }

    return PRODUCTION_SITE_URL
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv && !isLocalhost(fromEnv)) return normalizeOrigin(fromEnv)

  return fromEnv ? normalizeOrigin(fromEnv) : "http://localhost:3000"
}

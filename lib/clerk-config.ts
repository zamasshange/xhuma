import { env } from "@/lib/env"

/** Strip trailing slash — Clerk appends paths and a trailing / causes // in script URLs */
function normalizeProxyUrl(url: string): string | undefined {
  const trimmed = url.trim().replace(/\/+$/, "")
  return trimmed || undefined
}

/** Only use proxy on production; localhost talks to clerk.xhuma.cc directly */
function resolveProxyUrl(): string | undefined {
  const raw = env.clerk.proxyUrl
  if (!raw) return undefined
  if (process.env.NODE_ENV === "development") return undefined
  return normalizeProxyUrl(raw)
}

/** Props passed to <ClerkProvider /> — sourced from .env.local / Vercel */
export const clerkProviderProps = {
  publishableKey: env.clerk.publishableKey || undefined,
  signInUrl: env.clerk.signInUrl,
  signUpUrl: env.clerk.signUpUrl,
  signInFallbackRedirectUrl: env.clerk.afterSignInUrl,
  signUpFallbackRedirectUrl: env.clerk.afterSignUpUrl,
  proxyUrl: resolveProxyUrl(),
} as const

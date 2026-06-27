/** Server-safe environment accessors */
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xhuma.cc",
  siteDomain: "xhuma.cc",

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-flash",
    configured: Boolean(process.env.OPENROUTER_API_KEY),
  },

  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
    secretKey: process.env.CLERK_SECRET_KEY ?? "",
    proxyUrl: process.env.NEXT_PUBLIC_CLERK_PROXY_URL ?? "",
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up",
    afterSignInUrl:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "/auth/continue",
    afterSignUpUrl:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? "/auth/continue",
    configured: Boolean(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
    ),
  },
} as const

export function assertOpenRouter() {
  if (!env.openrouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing — add it to .env.local")
  }
}

export function assertClerk() {
  if (!env.clerk.configured) {
    throw new Error(
      "Clerk keys missing — set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env.local",
    )
  }
}

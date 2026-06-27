import { env } from "@/lib/env"

/** Props passed to <ClerkProvider /> — sourced from .env.local */
export const clerkProviderProps = {
  signInUrl: env.clerk.signInUrl,
  signUpUrl: env.clerk.signUpUrl,
  signInFallbackRedirectUrl: env.clerk.afterSignInUrl,
  signUpFallbackRedirectUrl: env.clerk.afterSignUpUrl,
} as const

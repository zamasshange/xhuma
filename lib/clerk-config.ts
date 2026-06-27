import { env } from "@/lib/env"

/** Props passed to <ClerkProvider /> — talks directly to clerk.xhuma.cc via publishable key */
export const clerkProviderProps = {
  publishableKey: env.clerk.publishableKey || undefined,
  signInUrl: env.clerk.signInUrl,
  signUpUrl: env.clerk.signUpUrl,
  signInFallbackRedirectUrl: env.clerk.afterSignInUrl,
  signUpFallbackRedirectUrl: env.clerk.afterSignUpUrl,
} as const

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/onboarding(.*)", "/claim(.*)", "/dashboard(.*)"])

/** Proxy Clerk only on production — localhost uses clerk.xhuma.cc directly */
function shouldProxy(hostname: string): boolean {
  return hostname === "xhuma.cc" || hostname === "www.xhuma.cc"
}

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect()
    }
  },
  {
    frontendApiProxy: {
      enabled: (url) => shouldProxy(url.hostname),
    },
  },
)

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}

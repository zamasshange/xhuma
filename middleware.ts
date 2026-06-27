import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/onboarding(.*)", "/claim(.*)", "/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const host = req.nextUrl.hostname

  // Canonical domain: always xhuma.cc (fixes Clerk handshake www mismatch)
  if (host === "www.xhuma.cc") {
    const url = req.nextUrl.clone()
    url.hostname = "xhuma.cc"
    return NextResponse.redirect(url, 308)
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}

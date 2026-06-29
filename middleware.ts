import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { regionFromCountryCode } from "@/lib/region/config"
import { REGION_COOKIE } from "@/lib/region/detect"

const isProtectedRoute = createRouteMatcher(["/onboarding(.*)", "/claim(.*)", "/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const response = NextResponse.next()
  if (!req.cookies.get(REGION_COOKIE)) {
    const country =
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("cf-ipcountry") ??
      req.headers.get("x-country-code")
    const region = regionFromCountryCode(country)
    response.cookies.set(REGION_COOKIE, region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }
  return response
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}

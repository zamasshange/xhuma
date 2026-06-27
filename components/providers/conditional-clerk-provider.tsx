"use client"

import { usePathname } from "next/navigation"
import { ClerkProvider } from "@clerk/nextjs"
import { clerkProviderProps } from "@/lib/clerk-config"

/** Only load Clerk JS on routes that render Clerk UI components */
const CLERK_UI_PREFIXES = ["/sign-in", "/sign-up", "/dashboard", "/editor"]

function needsClerkUi(pathname: string) {
  return CLERK_UI_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function ConditionalClerkProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ""

  if (!needsClerkUi(pathname)) {
    return <>{children}</>
  }

  return <ClerkProvider {...clerkProviderProps}>{children}</ClerkProvider>
}

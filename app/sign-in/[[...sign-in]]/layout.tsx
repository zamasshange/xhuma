import type { ReactNode } from "react"
import type { Metadata } from "next"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Sign in",
  robots: NOINDEX_ROBOTS,
}

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children
}

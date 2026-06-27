import type { ReactNode } from "react"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description:
    "Log in to your Xhuma account to manage your AI link in bio page, analytics, themes, and creator tools.",
  path: "/sign-in",
})

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children
}

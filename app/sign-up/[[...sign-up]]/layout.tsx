import type { ReactNode } from "react"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Create Your Free Xhuma Account",
  description:
    "Sign up free on Xhuma and build your AI-powered link in bio page in minutes. Perfect for creators, businesses, and entrepreneurs in South Africa.",
  path: "/sign-up",
  absoluteTitle: true,
})

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children
}

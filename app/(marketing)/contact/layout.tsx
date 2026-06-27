import type { ReactNode } from "react"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("contact")

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}

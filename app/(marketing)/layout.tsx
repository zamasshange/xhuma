import type { ReactNode } from "react"
import type { Metadata } from "next"
import { BiolinkNavbar } from "@/components/marketing/biolink/navbar"
import { BiolinkFooter } from "@/components/marketing/biolink/footer"
import { SITE_NAME } from "@/lib/brand"

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Your Entire Online Presence, Powered by AI`,
    template: `%s | ${SITE_NAME}`,
  },
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="biolink-marketing flex min-h-dvh flex-col scroll-smooth bg-white text-bio-dark">
      <BiolinkNavbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <BiolinkFooter />
    </div>
  )
}

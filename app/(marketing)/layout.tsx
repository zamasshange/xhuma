import type { ReactNode } from "react"
import { BiolinkNavbar } from "@/components/marketing/biolink/navbar"
import { BiolinkFooter } from "@/components/marketing/biolink/footer"

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="biolink-marketing flex min-h-dvh flex-col scroll-smooth bg-white text-bio-dark">
      <BiolinkNavbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <BiolinkFooter />
    </div>
  )
}

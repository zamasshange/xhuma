import type { ReactNode } from "react"
import { BiolinkNavbar } from "@/components/marketing/biolink/navbar"
import { BiolinkFooter } from "@/components/marketing/biolink/footer"
import { RegionProvider } from "@/components/providers/region-provider"
import { detectRegion } from "@/lib/region/detect"

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const region = await detectRegion()

  return (
    <RegionProvider region={region}>
      <div className="biolink-marketing flex min-h-dvh flex-col overflow-x-hidden scroll-smooth bg-white text-bio-dark">
        <BiolinkNavbar />
        <main id="main-content" className="flex-1 overflow-x-hidden">
          {children}
        </main>
        <BiolinkFooter />
      </div>
    </RegionProvider>
  )
}

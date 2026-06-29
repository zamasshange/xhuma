import { BiolinkHero } from "@/components/marketing/biolink/hero"
import { CreatorMarquee } from "@/components/marketing/biolink/creator-marquee"
import { TemplateMarketplace } from "@/components/templates/template-marketplace"
import { AiAssistantSection } from "@/components/marketing/biolink/ai-assistant-section"
import { BiolinkPricing } from "@/components/marketing/biolink/pricing-section"
import { CompareSection } from "@/components/marketing/biolink/compare-section"
import { BiolinkFaq } from "@/components/marketing/biolink/faq-section"
import { ClaimFooterSection } from "@/components/marketing/biolink/claim-footer"
import { HomeJsonLd } from "@/components/seo/home-json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("home")

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <BiolinkHero />
      <CreatorMarquee />
      <TemplateMarketplace />
      <AiAssistantSection />
      <BiolinkPricing />
      <CompareSection />
      <BiolinkFaq />
      <ClaimFooterSection />
    </>
  )
}

import { BiolinkHero } from "@/components/marketing/biolink/hero"
import { CreatorMarquee } from "@/components/marketing/biolink/creator-marquee"
import { TemplatesGallery } from "@/components/templates/templates-gallery"
import { AiAssistantSection } from "@/components/marketing/biolink/ai-assistant-section"
import { BiolinkFeaturesGrid } from "@/components/marketing/biolink/features-grid"
import { BiolinkPricing } from "@/components/marketing/biolink/pricing-section"
import { CompareSection } from "@/components/marketing/biolink/compare-section"
import { BiolinkFaq } from "@/components/marketing/biolink/faq-section"
import { ClaimFooterSection } from "@/components/marketing/biolink/claim-footer"

export default function HomePage() {
  return (
    <>
      <BiolinkHero />
      <CreatorMarquee />
      <TemplatesGallery />
      <AiAssistantSection />
      <BiolinkFeaturesGrid />
      <BiolinkPricing />
      <CompareSection />
      <BiolinkFaq />
      <ClaimFooterSection />
    </>
  )
}

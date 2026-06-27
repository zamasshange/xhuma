import { BiolinkFeaturesGrid } from "@/components/marketing/biolink/features-grid"
import { AiAssistantSection } from "@/components/marketing/biolink/ai-assistant-section"
import { ThemesSection } from "@/components/marketing/biolink/themes-section"
import { CompareSection } from "@/components/marketing/biolink/compare-section"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("features")

export default function FeaturesPage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Features", href: "/features" },
        ]}
      />
      <SiteJsonLd />
      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Features</SectionBadge>
        <h1 className="mt-6 text-6xl font-semibold tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Everything creators need
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-bio-grey">
          A simple link-in-bio for your socials — designed for mobile, packed with features for a complete website.
        </p>
        <DarkButton href="/editor" className="mx-auto mt-8">
          Get started for free
        </DarkButton>
      </section>
      <BiolinkFeaturesGrid />
      <ThemesSection />
      <AiAssistantSection />
      <CompareSection />
    </>
  )
}

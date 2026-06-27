import { TemplateMarketplace } from "@/components/templates/template-marketplace"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("templates")

export default function TemplatesPage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Templates", href: "/templates" },
        ]}
      />
      <SiteJsonLd />
      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Templates</SectionBadge>
        <h1 className="mt-6 text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Link in bio templates
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-bio-grey">
          Pick a layout for creators, musicians, businesses, and portfolios — then customise everything with AI on Xhuma.
        </p>
        <DarkButton href="/editor" className="mx-auto mt-8">
          Start with a template
        </DarkButton>
      </section>
      <TemplateMarketplace showHeader={false} />
    </>
  )
}

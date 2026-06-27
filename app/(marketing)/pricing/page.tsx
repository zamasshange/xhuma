import { BiolinkPricing } from "@/components/marketing/biolink/pricing-section"
import { CompareSection } from "@/components/marketing/biolink/compare-section"
import { BiolinkFaq } from "@/components/marketing/biolink/faq-section"
import { SectionHeading } from "@/components/section-heading"
import { PricingCards } from "@/components/marketing/pricing-cards"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { comparisonRows } from "@/data/marketing"
import { Check, X } from "lucide-react"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("pricing")

export default function PricingPage() {
  return (
    <div className="text-bio-dark">
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />
      <BiolinkPricing />
      <CompareSection />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Also available"
          title="Xhuma plan tiers"
          description="Starter, Creator, Pro, and Business plans — priced in South African Rand for local creators and teams."
        />
        <div className="mt-10">
          <PricingCards />
        </div>
        <div className="mt-16 overflow-x-auto rounded-2xl border border-black/10">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-bio-grey">
                <th className="p-4 font-medium">Feature</th>
                <th className="p-4 font-medium">Starter</th>
                <th className="p-4 font-medium">Creator</th>
                <th className="p-4 font-medium">Pro</th>
                <th className="p-4 font-medium">Business</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-black/10 last:border-0">
                  <td className="p-4">{row.feature}</td>
                  {(["starter", "creator", "pro", "business"] as const).map((plan) => (
                    <td key={plan} className="p-4">
                      {row[plan] ? <Check className="size-5 text-bio-green" /> : <X className="size-5 text-bio-grey-d9" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <BiolinkFaq limit={4} />
    </div>
  )
}

import { faqs } from "@/data/marketing"
import { JsonLd } from "@/components/seo/json-ld"

export function FaqJsonLd({ items = faqs }: { items?: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  )
}

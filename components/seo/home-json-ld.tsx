import { SITE_NAME, SITE_URL } from "@/lib/brand"
import { absoluteUrl } from "@/lib/seo"
import { faqs } from "@/data/marketing"
import { JsonLd } from "@/components/seo/json-ld"

export function HomeJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.png"),
    sameAs: [],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "AI-powered link in bio platform for creators — build a beautiful, high-converting page in minutes.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/explore")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: SITE_URL,
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q.replace("Linkly", SITE_NAME),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/Linkly/g, SITE_NAME),
      },
    })),
  }

  return <JsonLd data={[organization, website, software, faqPage]} />
}

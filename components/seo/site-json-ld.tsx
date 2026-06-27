import { SITE_NAME, SITE_URL } from "@/lib/brand"
import { absoluteUrl } from "@/lib/seo"
import { faqs } from "@/data/marketing"
import { JsonLd } from "@/components/seo/json-ld"

export function SiteJsonLd({ includeFaq = false }: { includeFaq?: boolean }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "BDL Corp",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/favicon.png"),
    },
    description:
      "Xhuma is an AI-powered link in bio platform for creators, businesses, and entrepreneurs in South Africa, Africa, and worldwide.",
    areaServed: ["ZA", "Africa", "Worldwide"],
    sameAs: [
      "https://x.com/xhumacc",
      "https://www.instagram.com/xhumacc/",
      "https://www.youtube.com/@xhumacc",
      "https://www.tiktok.com/@xhumacc",
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["Xhuma AI", "Xhuma Link in Bio", SITE_URL.replace(/^https?:\/\//, "")],
    url: SITE_URL,
    description:
      "Create a beautiful AI-powered link in bio page. Share Instagram, TikTok, YouTube, WhatsApp, portfolio, and more from one smart link.",
    publisher: { "@type": "Organization", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/explore")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Link in Bio",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
    },
    description:
      "AI link in bio platform with bio generator, theme assistant, link suggestions, and analytics for creators.",
    url: SITE_URL,
    featureList: [
      "AI Bio Generator",
      "AI Theme Generator",
      "AI Link Recommendations",
      "Link in Bio Templates",
      "Analytics Dashboard",
      "WhatsApp & Social Links",
    ],
  }

  const schemas: Record<string, unknown>[] = [organization, website, software]

  if (includeFaq) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    })
  }

  return <JsonLd data={schemas} />
}

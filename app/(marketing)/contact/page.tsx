import Link from "next/link"
import { FaEnvelope, FaBuilding, FaLocationDot, FaPhone } from "react-icons/fa6"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { ContactForm } from "@/components/marketing/contact-form"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { pageMetadata } from "@/lib/seo"
import { COMPANY } from "@/lib/company"

export const metadata = pageMetadata("contact")

const CONTACT_ITEMS = [
  { icon: FaEnvelope, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: FaPhone, label: "Phone", value: COMPANY.phone, href: `tel:${COMPANY.phone.replace(/\s/g, "")}` },
  { icon: FaBuilding, label: "Company", value: COMPANY.legalName },
  { icon: FaLocationDot, label: "Location", value: COMPANY.country },
] as const

export default function ContactPage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />
      <SiteJsonLd />

      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Contact</SectionBadge>
        <h1 className="mt-6 text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Get in touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-bio-grey">
          If you need support, partnerships, business inquiries, or technical help regarding {COMPANY.productName},
          feel free to reach out. We typically respond within 24–48 hours.
        </p>
      </section>

      <BioContainer className="pb-24 pt-12 max-sm:pb-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-3 lg:col-span-2">
            {CONTACT_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-bio-dark/8 bg-bio-grey-f4/40 p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-bio-dark text-white">
                  <item.icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-bio-grey">{item.label}</p>
                  {"href" in item && item.href ? (
                    <a href={item.href} className="font-semibold text-bio-dark hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-bio-dark">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-bio-dark/8 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="text-lg font-semibold text-bio-dark">Send us a message</h2>
            <p className="mt-1 text-sm text-bio-grey">Fill in the form below and we&apos;ll get back to you soon.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl text-center">
          <DarkButton href="/editor">Start with Xhuma</DarkButton>
          <p className="mt-4">
            <Link href="/" className="text-sm text-bio-grey underline underline-offset-2 hover:text-bio-dark">
              Back to homepage
            </Link>
          </p>
        </div>
      </BioContainer>
    </>
  )
}

import Link from "next/link"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { ProseSection } from "@/components/marketing/prose-section"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { pageMetadata } from "@/lib/seo"
import { COMPANY } from "@/lib/company"

export const metadata = pageMetadata("about")

const CAPABILITIES = [
  "Build a personalized link in bio page",
  "Use AI to generate bios, layouts, and content",
  "Share all social media links in one place",
  "Track engagement and clicks",
  "Customize themes and designs instantly",
]

export default function AboutPage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />
      <SiteJsonLd />

      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>About</SectionBadge>
        <h1 className="mt-6 text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          About Xhuma
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-bio-grey">
          An AI-powered Link in Bio platform built for creators, businesses, and entrepreneurs across South Africa
          and Africa.
        </p>
      </section>

      <BioContainer className="pb-24 pt-12 max-sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <ProseSection title="What is Xhuma?">
            <p>
              {COMPANY.productName} is an AI-powered Link in Bio platform designed to help creators, businesses,
              freelancers, influencers, musicians, and entrepreneurs build a powerful online presence in minutes.
            </p>
            <p>
              Instead of just sharing links, {COMPANY.productName} helps users create a fully branded digital identity
              with AI assistance — a modern {COMPANY.tagline.toLowerCase()} experience from one smart page.
            </p>
          </ProseSection>

          <ProseSection title="What you can do on Xhuma">
            <ul className="list-disc space-y-2 pl-5">
              {CAPABILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              {COMPANY.productName} is built for modern creators who want more than a basic link-in-bio tool — it is a
              creator platform powered by intelligence and automation.
            </p>
          </ProseSection>

          <ProseSection title="Our vision">
            <p>
              To empower creators across South Africa and Africa to build their digital identity effortlessly using AI.
            </p>
          </ProseSection>

          <ProseSection title="Built by BDL Corp">
            <p>
              {COMPANY.productName} is a product of <strong className="text-bio-dark">{COMPANY.legalName}</strong>,
              based in {COMPANY.country}. We are committed to helping creators own their audience with beautiful,
              intelligent link-in-bio pages.
            </p>
            <p>
              Questions?{" "}
              <Link href="/contact" className="font-medium text-bio-dark underline underline-offset-2">
                Contact our team
              </Link>
              .
            </p>
          </ProseSection>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <DarkButton href="/editor">Start building for free</DarkButton>
            <Link href="/" className="text-sm text-bio-grey underline underline-offset-2 hover:text-bio-dark">
              Back to homepage
            </Link>
          </div>
        </div>
      </BioContainer>
    </>
  )
}

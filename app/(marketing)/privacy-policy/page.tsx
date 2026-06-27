import Link from "next/link"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { ProseSection } from "@/components/marketing/prose-section"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { buildMetadata } from "@/lib/seo"
import { COMPANY } from "@/lib/company"

export const metadata = buildMetadata({
  title: "Privacy Policy — Xhuma",
  description:
    "How Xhuma by BDL Corp collects, uses, and protects your personal data. POPIA-aware privacy practices for South African creators.",
  path: "/privacy-policy",
  absoluteTitle: true,
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />

      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Legal</SectionBadge>
        <h1 className="mt-6 text-6xl font-semibold tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-bio-grey">
          Last updated: 27 June 2026. How {COMPANY.productName} handles your information.
        </p>
      </section>

      <BioContainer className="pb-24 pt-12 max-sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <ProseSection title="1. Introduction">
            <p>
              {COMPANY.productName} (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a product of{" "}
              {COMPANY.legalName} based in {COMPANY.country}. We respect your privacy and are committed to protecting
              your personal data when you use our AI-powered Link in Bio platform.
            </p>
          </ProseSection>

          <ProseSection title="2. Information we collect">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Account information (name, username, email if applicable)</li>
              <li>Profile data (bio, links, images, and page content)</li>
              <li>Usage data (clicks, page views, and engagement analytics)</li>
              <li>Device and browser information (for security and performance)</li>
            </ul>
          </ProseSection>

          <ProseSection title="3. How we use information">
            <p>We use your data to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide and improve {COMPANY.productName} services</li>
              <li>Personalise your experience and page layouts</li>
              <li>Generate analytics and insights for your profile</li>
              <li>Improve AI features and recommendations</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </ProseSection>

          <ProseSection title="4. Data sharing">
            <p>
              <strong className="text-bio-dark">We do NOT sell your personal data.</strong>
            </p>
            <p>We may share data only with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Service providers (e.g. Supabase, hosting, email, and authentication services)</li>
              <li>Legal authorities when required by applicable law</li>
            </ul>
          </ProseSection>

          <ProseSection title="5. Data storage">
            <p>
              Data is securely stored using cloud infrastructure and protected with industry-standard security measures,
              including encryption in transit and access controls.
            </p>
          </ProseSection>

          <ProseSection title="6. Cookies">
            <p>
              We may use cookies and similar technologies for authentication, analytics, and improving user
              experience. You can manage cookie preferences in your browser settings.
            </p>
          </ProseSection>

          <ProseSection title="7. User rights">
            <p>Depending on applicable law (including POPIA in South Africa), you may:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Request deletion of your personal data</li>
              <li>Update or correct your personal information</li>
              <li>Export your data (export features may be added in future releases)</li>
            </ul>
          </ProseSection>

          <ProseSection title="8. Contact">
            <p>
              For privacy concerns or data requests, email us at{" "}
              <a href={`mailto:${COMPANY.email}`} className="font-medium text-bio-dark underline">
                {COMPANY.email}
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="font-medium text-bio-dark underline">
                Contact page
              </Link>
              .
            </p>
          </ProseSection>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <DarkButton href="/">Back to Xhuma</DarkButton>
          </div>
        </div>
      </BioContainer>
    </>
  )
}

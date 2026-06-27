import Link from "next/link"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { ProseSection } from "@/components/marketing/prose-section"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { buildMetadata } from "@/lib/seo"
import { COMPANY } from "@/lib/company"

export const metadata = buildMetadata({
  title: "Terms of Service — Xhuma",
  description:
    "Terms and conditions for using the Xhuma AI link in bio platform by BDL Corp. User responsibilities, acceptable use, and liability.",
  path: "/terms-of-service",
  absoluteTitle: true,
})

export default function TermsOfServicePage() {
  return (
    <>
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms-of-service" },
        ]}
      />

      <section className="mx-auto w-[min(900px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Legal</SectionBadge>
        <h1 className="mt-6 text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Terms of Service
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-bio-grey">
          Last updated: 27 June 2026. Please read these terms before using {COMPANY.productName}.
        </p>
      </section>

      <BioContainer className="pb-24 pt-12 max-sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <ProseSection title="1. Acceptance of terms">
            <p>
              By accessing or using {COMPANY.productName}, you agree to these Terms of Service. If you do not agree,
              please do not use the platform.
            </p>
          </ProseSection>

          <ProseSection title="2. Description of service">
            <p>
              {COMPANY.productName} is an AI-powered Link in Bio platform operated by {COMPANY.legalName} that allows
              users to create, customise, and publish personal landing pages for social media and business use.
            </p>
          </ProseSection>

          <ProseSection title="3. User responsibilities">
            <p>Users agree to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide accurate account and profile information</li>
              <li>Not misuse the platform or its AI features</li>
              <li>Not upload harmful, illegal, or infringing content</li>
              <li>Respect the integrity and security of the platform</li>
            </ul>
          </ProseSection>

          <ProseSection title="4. Account usage">
            <p>Users are responsible for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>All content published on their profile page</li>
              <li>All links shared through their page</li>
              <li>Any activity conducted under their account</li>
            </ul>
          </ProseSection>

          <ProseSection title="5. Prohibited activities">
            <p>Users may NOT:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use {COMPANY.productName} for illegal purposes</li>
              <li>Attempt to hack, disrupt, or reverse-engineer the system</li>
              <li>Upload malicious code or harmful content</li>
              <li>Impersonate others or misrepresent their identity</li>
            </ul>
          </ProseSection>

          <ProseSection title="6. Termination">
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or pose a risk to other
              users or the platform.
            </p>
          </ProseSection>

          <ProseSection title="7. Limitation of liability">
            <p>
              {COMPANY.productName} and {COMPANY.legalName} are not liable for indirect damages, including but not
              limited to:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Data loss</li>
              <li>Service downtime or interruptions</li>
              <li>User-generated content or third-party links</li>
            </ul>
            <p>The service is provided to the fullest extent permitted by applicable law in {COMPANY.country}.</p>
          </ProseSection>

          <ProseSection title="8. Changes to terms">
            <p>
              We may update these Terms of Service at any time. Continued use of {COMPANY.productName} after changes
              constitutes acceptance of the updated terms.
            </p>
          </ProseSection>

          <ProseSection title="9. Contact">
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${COMPANY.email}`} className="font-medium text-bio-dark underline">
                {COMPANY.email}
              </a>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-bio-dark underline">
                contact us
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

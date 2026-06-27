import type { Metadata } from "next"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { buildMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/brand"

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms and conditions for using the ${SITE_NAME} link-in-bio platform.`,
  path: "/terms",
})

const sections = [
  {
    title: "Acceptance of terms",
    body: `By creating an account or using ${SITE_NAME}, you agree to these Terms of Service. If you do not agree, please do not use the platform.`,
  },
  {
    title: "Your account",
    body: "You are responsible for maintaining the security of your account and for all activity under it. You must provide accurate information and keep your credentials confidential.",
  },
  {
    title: "Acceptable use",
    body: "You may not use Xhuma for unlawful activity, spam, harassment, malware distribution, or content that infringes intellectual property rights. We may suspend accounts that violate these rules.",
  },
  {
    title: "Your content",
    body: "You retain ownership of content you publish on your page. By publishing content, you grant Xhuma a licence to host, display, and distribute it solely to operate the service.",
  },
  {
    title: "Subscriptions & billing",
    body: "Paid plans are billed in South African Rand (ZAR). Subscriptions renew automatically unless cancelled. Refunds are handled in accordance with the Consumer Protection Act where applicable.",
  },
  {
    title: "Limitation of liability",
    body: "Xhuma is provided \"as is\" to the fullest extent permitted by South African law. BDL Corp is not liable for indirect or consequential damages arising from use of the platform.",
  },
  {
    title: "Contact",
    body: "Questions about these terms? Email hello@xhuma.cc.",
  },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Legal"
          title="Terms of Service"
          description={`Last updated: 27 June 2026. Please read these terms carefully before using ${SITE_NAME}.`}
          align="left"
        />
      </Reveal>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <Reveal key={section.title}>
            <section>
              <h2 className="text-lg font-semibold text-bio-dark">{section.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-bio-grey">{section.body}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { buildMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/brand"

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your personal information.`,
  path: "/privacy",
})

const sections = [
  {
    title: "Information we collect",
    body: "We collect information you provide when creating an account, building your page, or contacting support — including your name, email address, username, profile content, and usage analytics.",
  },
  {
    title: "How we use your information",
    body: "We use your information to operate and improve Xhuma, personalise your experience, provide customer support, send service-related communications, and keep the platform secure.",
  },
  {
    title: "Data storage & security",
    body: "Your data is stored on secure infrastructure with encryption in transit and at rest. We do not sell your personal information to third parties.",
  },
  {
    title: "Your rights",
    body: "Under the Protection of Personal Information Act (POPIA), you may request access to, correction of, or deletion of your personal data. Contact us at hello@xhuma.cc to exercise these rights.",
  },
  {
    title: "Cookies & analytics",
    body: "We use essential cookies to keep you signed in and optional analytics to understand how the platform is used. You can manage cookie preferences in your browser settings.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, email hello@xhuma.cc or visit our Contact page.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Legal"
          title="Privacy Policy"
          description={`Last updated: 27 June 2026. This policy explains how ${SITE_NAME} handles your data.`}
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

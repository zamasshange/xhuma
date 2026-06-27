import { BiolinkFaq } from "@/components/marketing/biolink/faq-section"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto w-[min(700px,92%)] pt-32 text-center text-bio-dark max-lg:pt-24">
        <SectionBadge>Support</SectionBadge>
        <h1 className="mt-6 text-6xl font-semibold tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-4 text-lg text-bio-grey">
          Can&apos;t find what you need? <a href="/contact" className="underline">Contact us</a> anytime.
        </p>
      </section>
      <BiolinkFaq />
      <div className="pb-20 text-center">
        <DarkButton href="/editor">Start for free</DarkButton>
      </div>
    </>
  )
}

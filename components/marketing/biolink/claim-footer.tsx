import { ClaimLinkInput } from "@/components/marketing/biolink/claim-link"

export function ClaimFooterSection() {
  return (
    <section className="mx-auto w-[min(840px,92%)] pb-24 pt-20 text-center max-sm:pb-16 max-sm:pt-12">
      <h2 className="text-4xl font-semibold tracking-tighter text-bio-dark max-sm:text-3xl">
        Claim your bio link before it&apos;s taken
      </h2>
      <ClaimLinkInput
        className="mx-auto mt-8 w-[min(470px,98%)]"
        buttonLabel="Claim my link"
      />
    </section>
  )
}

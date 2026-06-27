import { ClaimLinkInput } from "@/components/marketing/biolink/claim-link"

export function ClaimFooterSection() {
  return (
    <section className="bg-white pb-8 pt-24 text-center max-sm:pb-4 max-sm:pt-16">
      <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tighter text-bio-dark max-sm:px-4 max-sm:text-3xl">
        Claim your bio link before it&apos;s taken
      </h2>
      <ClaimLinkInput
        className="mx-auto mt-8 w-[min(520px,92%)]"
        buttonLabel="Claim my link"
        variant="muted"
      />
    </section>
  )
}

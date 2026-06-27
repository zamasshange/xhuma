import { Suspense } from "react"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center text-bio-grey">Loading…</div>}>
      <OnboardingWizard />
    </Suspense>
  )
}

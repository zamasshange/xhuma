import { Suspense } from "react"
import ClaimPageClient from "./claim-client"

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#f7f7f8] text-bio-grey">
          Loading…
        </div>
      }
    >
      <ClaimPageClient />
    </Suspense>
  )
}

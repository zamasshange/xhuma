"use client"

import Link from "next/link"

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="xhuma-site flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
      <div className="max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold text-bio-dark">Something went wrong</p>
        <p className="mt-2 text-sm text-bio-grey">
          {error.message || "The onboarding page hit an error. You can try again or go back."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-bio-dark px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-bio-dark/15 px-6 py-3 text-sm font-semibold text-bio-dark"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}

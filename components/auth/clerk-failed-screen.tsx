"use client"

import Link from "next/link"

export function ClerkFailedScreen() {
  return (
    <div className="xhuma-site flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
      <div className="max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold text-bio-dark">Sign-in service unavailable</p>
        <p className="mt-2 text-sm text-bio-grey">
          Clerk could not load on this page. This usually means environment variables are missing on
          the server, or the Clerk proxy is not configured for your domain.
        </p>
        <ul className="mt-4 space-y-1 text-left text-sm text-bio-grey">
          <li>• Set Clerk keys in Vercel (Production)</li>
          <li>• Set <code className="text-bio-dark">NEXT_PUBLIC_CLERK_PROXY_URL</code> to your site + <code className="text-bio-dark">/__clerk/</code></li>
          <li>• Redeploy after adding env vars</li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-bio-dark px-6 py-3 text-sm font-semibold text-white"
          >
            Reload
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

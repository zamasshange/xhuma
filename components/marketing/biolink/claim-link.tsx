"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api-fetch"
import { isValidUsername, sanitizeUsername } from "@/lib/username"
import { SITE_DOMAIN } from "@/lib/brand"
import type { DbProfile } from "@/lib/database.types"

type ClaimLinkInputProps = {
  className?: string
  buttonLabel?: string
  onSuccess?: () => void
  /** Grey pill style for footer CTA (bio.link style) */
  variant?: "default" | "muted"
}

export async function isSignedInViaApi(): Promise<boolean> {
  const res = await apiFetch<DbProfile | null>("/api/profile")
  return res.success
}

export function ClaimLinkInput({
  className,
  buttonLabel = "Start for free",
  onSuccess,
  variant = "default",
}: ClaimLinkInputProps) {
  const [username, setUsername] = useState("")

  const goToTemplates = () => {
    window.location.assign("/#templates")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = sanitizeUsername(username)

    if (!isValidUsername(slug)) {
      toast.error("Pick a username (3–20 letters, numbers, _ or -)")
      return
    }

    onSuccess?.()

    const profileCheck = await apiFetch<DbProfile | null>("/api/profile")
    const signedIn = profileCheck.success && profileCheck.data !== undefined

    if (!signedIn) {
      const dest = `/onboarding?username=${encodeURIComponent(slug)}`
      window.location.assign(`/sign-up?redirect_url=${encodeURIComponent(dest)}`)
      return
    }

    const profileRes = await apiFetch<DbProfile | null>("/api/profile")
    const draftRes = await apiFetch<unknown>("/api/draft")

    if (profileRes.success && profileRes.data) {
      window.location.assign(`/${profileRes.data.username}`)
      return
    }

    if (draftRes.success && draftRes.data) {
      window.location.assign(`/claim?username=${encodeURIComponent(slug)}`)
      return
    }

    window.location.assign(`/onboarding?username=${encodeURIComponent(slug)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative z-20", className)}>
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-full",
          variant === "muted"
            ? "bg-bio-grey-f4"
            : "border-2 border-bio-dark bg-white shadow-sm",
        )}
      >
        <span className="shrink-0 pl-5 text-base text-bio-dark max-sm:pl-4 max-sm:text-sm">{SITE_DOMAIN}/</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="name"
          className="min-w-0 flex-1 bg-transparent py-4 pr-2 text-base text-bio-dark outline-none placeholder:text-bio-grey max-sm:py-3.5 max-sm:text-sm"
          aria-label="Choose your username"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="m-1.5 shrink-0 rounded-full bg-bio-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bio-dark/80 max-sm:px-4 max-sm:py-2.5"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}

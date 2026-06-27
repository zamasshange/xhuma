"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbProfile } from "@/lib/database.types"

type ClaimLinkInputProps = {
  className?: string
  buttonLabel?: string
  onSuccess?: () => void
}

export function ClaimLinkInput({
  className,
  buttonLabel = "Start for free",
  onSuccess,
}: ClaimLinkInputProps) {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const goToEditor = (slug?: string) => {
    const url = slug ? `/editor?username=${encodeURIComponent(slug)}` : "/editor"
    window.location.assign(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = sanitizeUsername(username)

    if (!isValidUsername(slug)) {
      toast.error("Pick a username (3–20 letters, numbers, _ or -)")
      return
    }

    getUserId()
    setLoading(true)

    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({
        username: slug,
        display_name: displayNameFromUsername(slug),
        bio: "",
      }),
    })

    setLoading(false)

    if (res.success) {
      onSuccess?.()
      toast.success("Your page is ready — add your links!")
      goToEditor()
      return
    }

    const err = res.error ?? ""

    if (err.includes("Profile already exists")) {
      goToEditor()
      return
    }

    if (err.includes("Username already taken")) {
      toast.error("That username is taken — try another")
      return
    }

    toast.error(err || "Could not create page — try again in the editor")
    goToEditor(slug)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative z-20", className)}>
      <div className="flex items-center overflow-hidden rounded-full border-2 border-bio-dark bg-white shadow-sm">
        <span className="shrink-0 pl-5 text-base text-bio-grey max-sm:pl-4 max-sm:text-sm">xhuma.io/</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className="min-w-0 flex-1 bg-transparent py-4 pr-2 text-base text-bio-dark outline-none placeholder:text-bio-grey/60 max-sm:py-3.5 max-sm:text-sm"
          aria-label="Choose your username"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="m-1.5 shrink-0 rounded-full bg-bio-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bio-dark/80 disabled:opacity-60 max-sm:px-4 max-sm:py-2.5"
        >
          {loading ? "Starting…" : buttonLabel}
        </button>
      </div>
    </form>
  )
}

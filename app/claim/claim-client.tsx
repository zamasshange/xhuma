"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { BioGradientButton, BioLabel, BioMuted } from "@/components/ui/bio-form"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import { SITE_DOMAIN } from "@/lib/brand"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbProfile } from "@/lib/database.types"
import Link from "next/link"

export default function ClaimPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState(searchParams.get("username") ?? "")
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    getUserId()
  }, [])

  const checkUsername = useCallback(async (slug: string) => {
    if (!isValidUsername(slug)) {
      setAvailable(null)
      return
    }
    setChecking(true)
    const res = await apiFetch<{ available: boolean }>(
      `/api/profile/check?username=${encodeURIComponent(slug)}`,
    )
    setChecking(false)
    if (res.success && res.data) setAvailable(res.data.available)
  }, [])

  useEffect(() => {
    const slug = sanitizeUsername(username)
    if (!slug) {
      setAvailable(null)
      return
    }
    const t = setTimeout(() => checkUsername(slug), 400)
    return () => clearTimeout(t)
  }, [username, checkUsername])

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = sanitizeUsername(username)
    if (!isValidUsername(slug)) {
      toast.error("Enter a valid username (3–20 characters)")
      return
    }
    setClaiming(true)
    const res = await apiFetch<DbProfile>("/api/claim", {
      method: "POST",
      body: JSON.stringify({ username: slug }),
    })
    setClaiming(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Could not claim username")
      return
    }
    toast.success("Your page is live!")
    router.replace(`/${res.data.username}`)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f7f8] text-bio-dark">
      <header className="px-6 py-5">
        <Link href="/">
          <LogoMark height={32} />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Claim your link</h1>
        <BioMuted className="mt-2">This is the final step — pick your username and go live.</BioMuted>

        <form onSubmit={handleClaim} className="mt-8 flex flex-col gap-4">
          <div>
            <BioLabel>Your link</BioLabel>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
              <span className="text-sm text-bio-grey">{SITE_DOMAIN}/</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
                value={username}
                onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                placeholder="yourname"
                autoFocus
                required
              />
            </div>
            {username && (
              <p className="mt-2 text-xs text-bio-grey">
                {checking
                  ? "Checking…"
                  : available === true
                    ? "✓ Available"
                    : available === false
                      ? "Username taken"
                      : isValidUsername(sanitizeUsername(username))
                        ? ""
                        : "3–20 chars, letters, numbers, _ or -"}
              </p>
            )}
          </div>

          <BioGradientButton
            type="submit"
            disabled={claiming || available === false || !isValidUsername(sanitizeUsername(username))}
          >
            {claiming ? "Going live…" : "Go live"}
          </BioGradientButton>

          <Link href="/editor" className="text-center text-sm font-semibold text-bio-grey hover:text-bio-dark">
            ← Back to editor
          </Link>
        </form>
      </main>
    </div>
  )
}

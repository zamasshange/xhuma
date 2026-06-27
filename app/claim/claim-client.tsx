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
          <LogoMark height={28} maxWidth={118} />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Claim your link</h1>
          <BioMuted className="mt-2 text-sm leading-relaxed">
            This is the final step — pick your username and go live.
          </BioMuted>

          <form onSubmit={handleClaim} className="mt-6 flex flex-col gap-5">
            <div>
              <BioLabel>Your link</BioLabel>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 focus-within:border-black/20 focus-within:ring-2 focus-within:ring-black/5">
                <span className="shrink-0 text-sm font-medium text-bio-grey">{SITE_DOMAIN}/</span>
                <input
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-bio-grey/60"
                  value={username}
                  onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                  placeholder="yourname"
                  autoFocus
                  required
                />
              </div>
              {username && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    available === true
                      ? "text-emerald-600"
                      : available === false
                        ? "text-red-600"
                        : "text-bio-grey"
                  }`}
                >
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
              className="w-full"
              disabled={claiming || available === false || !isValidUsername(sanitizeUsername(username))}
            >
              {claiming ? "Going live…" : "Go live"}
            </BioGradientButton>
          </form>
        </div>

        <Link
          href="/editor"
          className="mt-6 text-center text-sm font-semibold text-bio-grey transition-colors hover:text-bio-dark"
        >
          ← Back to editor
        </Link>
      </main>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ClaimLinkInput({ className }: { className?: string }) {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
    router.push(slug ? `/dashboard?username=${slug}` : "/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="flex items-center overflow-hidden rounded-full border-2 border-bio-dark bg-white shadow-sm">
        <span className="shrink-0 pl-5 text-base text-bio-grey max-sm:pl-4 max-sm:text-sm">xhuma.io/</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className="min-w-0 flex-1 bg-transparent py-4 pr-2 text-base text-bio-dark outline-none placeholder:text-bio-grey/60 max-sm:py-3.5 max-sm:text-sm"
          aria-label="Choose your username"
        />
        <button
          type="submit"
          className="m-1.5 shrink-0 rounded-full bg-bio-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bio-dark/80 max-sm:px-4 max-sm:py-2.5"
        >
          Claim
        </button>
      </div>
    </form>
  )
}

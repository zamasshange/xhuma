"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { apiFetch } from "@/lib/api-fetch"
import type { DbProfile } from "@/lib/database.types"

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({
        username: username.toLowerCase().trim(),
        display_name: displayName.trim(),
      }),
    })
    setLoading(false)
    if (!res.success) {
      toast.error(res.error ?? "Could not create profile")
      return
    }
    toast.success("Your page is ready!")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Claim your link</h1>
        <p className="mt-1 text-muted-foreground">Pick a username for your public page. You can change it later.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">xhuma.io/</span>
              <Input
                id="username"
                className="h-12 flex-1"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="yourname"
                minLength={3}
                maxLength={20}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">3–20 characters, lowercase letters, numbers, _ or -</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              className="h-12"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <Button type="submit" className="h-12 bg-brand-gradient text-brand-foreground" disabled={loading}>
            {loading ? "Creating…" : "Create my page"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import type { DbProfile } from "@/lib/database.types"
import { SITE_DOMAIN } from "@/lib/brand"

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState(searchParams.get("username") ?? "")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    getUserId() // ensure uuid exists
    setLoading(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({
        username: username.toLowerCase().trim(),
        display_name: displayName.trim(),
        bio: bio.trim(),
      }),
    })
    setLoading(false)
    if (!res.success) {
      toast.error(res.error ?? "Could not create profile")
      return
    }
    toast.success("Your page is live!")
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-10">
      <div className="mb-8">
        <Logo height={36} />
      </div>

      <Card className="w-full max-w-lg p-6 sm:p-8">
        <h1 className="font-heading text-2xl font-semibold">Create your page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No account needed. Your browser saves your ID so you can edit later.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{SITE_DOMAIN}/</span>
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
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Name</Label>
            <Input
              id="displayName"
              className="h-12"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              className="min-h-[100px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short intro for your visitors…"
            />
          </div>

          <Button type="submit" className="h-12 bg-brand-gradient text-brand-foreground" disabled={loading}>
            {loading ? "Creating…" : "Create page"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already created one?{" "}
          <Link href="/dashboard" className="font-medium text-brand hover:underline">
            Go to dashboard
          </Link>
        </p>
      </Card>
    </div>
  )
}

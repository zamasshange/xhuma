"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { apiFetch } from "@/lib/api-fetch"
import { createClient } from "@/lib/supabase/client"
import type { DbProfile } from "@/lib/database.types"

export default function ProfileEditorPage() {
  const { profile, links, loading, setProfile } = useDashboard()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (loading || !profile) {
    return <p className="text-muted-foreground">Loading profile…</p>
  }

  const update = (key: keyof DbProfile, value: string) => {
    setProfile({ ...profile, [key]: value })
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio ?? "",
      }),
    })
    setSaving(false)
    if (!res.success) {
      toast.error(res.error ?? "Save failed")
      return
    }
    if (res.data) setProfile(res.data)
    toast.success("Profile saved!")
  }

  const uploadAvatar = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB")
      return
    }
    setUploading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setUploading(false)
      toast.error("Not authenticated")
      return
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    const path = `${user.id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true })
    if (uploadError) {
      setUploading(false)
      toast.error(uploadError.message)
      return
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ avatar_url: urlData.publicUrl }),
    })
    setUploading(false)
    if (!res.success) {
      toast.error(res.error ?? "Could not save avatar")
      return
    }
    if (res.data) setProfile(res.data)
    toast.success("Avatar updated!")
  }

  const activeLinks = links.filter((l) => l.is_active).map((l) => ({ id: l.id, title: l.title, url: l.url }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Profile</h1>
          <p className="mt-1 text-muted-foreground">Edit your public profile. Changes preview live on the right.</p>
        </div>
        <Button render={<Link href={`/${profile.username}`} />} variant="outline" className="h-11">
          <ExternalLink className="size-4" />
          View live page
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <form className="flex flex-col gap-5" onSubmit={save}>
            <div className="flex items-center gap-4">
              <Avatar src={profile.avatar_url ?? undefined} alt={profile.display_name} className="size-16" />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadAvatar(file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="h-11"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "Uploading…" : "Change avatar"}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                className="h-12 text-base"
                value={profile.display_name}
                onChange={(e) => update("display_name", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="h-12 text-base"
                value={profile.username}
                onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="min-h-[120px] text-base"
                value={profile.bio ?? ""}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="sticky bottom-24 h-12 w-full bg-brand-gradient text-brand-foreground lg:static lg:w-auto lg:px-8"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Card>

        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">
            Live preview
          </div>
          <div className="max-h-[70dvh] overflow-y-auto">
            <DbPublicProfileView profile={profile} links={activeLinks} />
          </div>
        </div>
      </div>
    </div>
  )
}

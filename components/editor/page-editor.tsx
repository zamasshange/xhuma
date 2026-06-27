"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import { SITE_DOMAIN } from "@/lib/brand"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"

const THEME_PRESETS = [
  { name: "Dark", theme: { bg: "#0f0f0f", text: "#ffffff", button: "#7c3aed", radius: "14px" } },
  { name: "Ocean", theme: { bg: "#0f172a", text: "#e2e8f0", button: "#3b82f6", radius: "12px" } },
  { name: "Clean", theme: { bg: "#fafafa", text: "#171717", button: "#171717", radius: "14px" } },
]

export function PageEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, links, loading, setProfile, setLinks, refreshLinks } = useDashboard()

  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [creating, setCreating] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, { title: string; url: string }>>({})
  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [addingLink, setAddingLink] = useState(false)

  useEffect(() => {
    const fromUrl = searchParams.get("username")
    if (fromUrl && !profile) {
      const slug = sanitizeUsername(fromUrl)
      setUsername(slug)
      setDisplayName((prev) => prev || displayNameFromUsername(slug))
    }
  }, [searchParams, profile])

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name)
      setBio(profile.bio ?? "")
      setUsername(profile.username)
    }
  }, [profile])

  const getDraft = useCallback(
    (link: DbLink) => drafts[link.id] ?? { title: link.title, url: link.url },
    [drafts],
  )

  const launchPage = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = sanitizeUsername(username)
    if (!isValidUsername(slug)) {
      toast.error("Username must be 3–20 characters (letters, numbers, _ or -)")
      return
    }
    if (!displayName.trim()) {
      toast.error("Add a display name")
      return
    }
    getUserId()
    setCreating(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({
        username: slug,
        display_name: displayName.trim(),
        bio: bio.trim(),
      }),
    })
    setCreating(false)
    if (!res.success) {
      toast.error(res.error ?? "Could not create page")
      return
    }
    if (res.data) setProfile(res.data)
    toast.success("Your page is live — add your first link!")
    router.replace("/editor", { scroll: false })
  }

  const saveProfile = async () => {
    if (!profile) return
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        display_name: displayName.trim(),
        bio: bio.trim(),
        username: username.toLowerCase().trim(),
      }),
    })
    if (!res.success) {
      toast.error(res.error ?? "Save failed")
      return
    }
    if (res.data) setProfile(res.data)
    toast.success("Profile updated")
  }

  const addLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Enter a title and URL")
      return
    }
    setAddingLink(true)
    const res = await apiFetch<DbLink>("/api/links", {
      method: "POST",
      body: JSON.stringify({ title: newLink.title.trim(), url: newLink.url.trim() }),
    })
    setAddingLink(false)
    if (!res.success) {
      toast.error(res.error ?? "Could not add link")
      return
    }
    setNewLink({ title: "", url: "" })
    await refreshLinks()
    toast.success("Link added!")
  }

  const saveLink = async (link: DbLink) => {
    const draft = getDraft(link)
    const res = await apiFetch("/api/links", {
      method: "PATCH",
      body: JSON.stringify({ id: link.id, title: draft.title, url: draft.url }),
    })
    if (!res.success) toast.error(res.error ?? "Save failed")
    else {
      await refreshLinks()
      setDrafts((d) => {
        const next = { ...d }
        delete next[link.id]
        return next
      })
    }
  }

  const removeLink = async (id: string) => {
    const res = await apiFetch(`/api/links?id=${id}`, { method: "DELETE" })
    if (!res.success) toast.error(res.error ?? "Delete failed")
    else await refreshLinks()
  }

  const moveLink = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= links.length) return
    const reordered = [...links]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    const withPos = reordered.map((l, i) => ({ ...l, position: i }))
    setLinks(withPos)
    await apiFetch("/api/links", {
      method: "PATCH",
      body: JSON.stringify({ links: withPos.map((l) => ({ id: l.id, position: l.position })) }),
    })
  }

  const applyTheme = async (theme: typeof DEFAULT_THEME) => {
    if (!profile) return
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ theme }),
    })
    if (res.success && res.data) {
      setProfile(res.data)
      toast.success("Theme applied")
    }
  }

  const previewProfile: DbProfile | null = profile
    ? {
        ...profile,
        display_name: displayName || profile.display_name,
        bio: bio ?? profile.bio,
        username: username || profile.username,
        theme_json: profile.theme_json,
      }
    : null

  const previewLinks = links
    .filter((l) => l.is_active)
    .map((l) => {
      const d = getDraft(l)
      return { id: l.id, title: d.title, url: d.url }
    })

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
        Loading your page…
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Top bar — bio.link style */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
        <LogoMark height={32} />
        {profile && (
          <p className="hidden truncate text-sm text-muted-foreground sm:block">
            {SITE_DOMAIN}/{profile.username}
          </p>
        )}
        <div className="flex items-center gap-2">
          {profile && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`)
                  toast.success("Link copied!")
                }}
              >
                <Share2 className="size-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button render={<Link href={`/${profile.username}`} target="_blank" />} size="sm" className="h-9">
                <ExternalLink className="size-4" />
                <span className="hidden sm:inline">View live</span>
              </Button>
            </>
          )}
          <Button render={<Link href="/dashboard/ai-studio" />} variant="outline" size="sm" className="h-9">
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">AI</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Editor panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:max-w-xl lg:border-r lg:border-border">
          {!profile ? (
            <Card className="p-5 sm:p-6">
              <h1 className="font-heading text-2xl font-semibold">Claim your link</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Set up your page in seconds — then add links on the right.
              </p>
              <form onSubmit={launchPage} className="mt-6 flex flex-col gap-4">
                <div>
                  <Label>Your link</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{SITE_DOMAIN}/</span>
                    <Input
                      className="h-11 flex-1"
                      value={username}
                      onChange={(e) => {
                        const slug = sanitizeUsername(e.target.value)
                        setUsername(slug)
                        if (!displayName || displayName === displayNameFromUsername(username)) {
                          setDisplayName(displayNameFromUsername(slug))
                        }
                      }}
                      placeholder="yourname"
                      required
                      minLength={3}
                      maxLength={20}
                    />
                  </div>
                </div>
                <div>
                  <Label>Display name</Label>
                  <Input
                    className="mt-1.5 h-11"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    className="mt-1.5 min-h-[80px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What should visitors know about you?"
                  />
                </div>
                <Button type="submit" className="h-12 bg-brand-gradient text-brand-foreground" disabled={creating}>
                  {creating ? "Creating…" : "Start building"}
                </Button>
              </form>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Profile */}
              <section>
                <h2 className="font-heading text-lg font-semibold">Profile</h2>
                <div className="mt-3 flex flex-col gap-3">
                  <Input
                    className="h-11"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                  />
                  <Textarea
                    className="min-h-[72px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                  />
                  <Button variant="outline" className="h-10 self-start" onClick={saveProfile}>
                    Save profile
                  </Button>
                </div>
              </section>

              {/* Links — core bio.link flow */}
              <section>
                <h2 className="font-heading text-lg font-semibold">Links</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add buttons visitors tap on your page.</p>

                <Card className="mt-3 border-brand/30 bg-brand/5 p-4">
                  <p className="mb-3 text-sm font-medium">Add a link</p>
                  <div className="flex flex-col gap-2">
                    <Input
                      className="h-11"
                      placeholder="Button text (e.g. Instagram)"
                      value={newLink.title}
                      onChange={(e) => setNewLink((l) => ({ ...l, title: e.target.value }))}
                    />
                    <Input
                      className="h-11"
                      placeholder="https://..."
                      value={newLink.url}
                      onChange={(e) => setNewLink((l) => ({ ...l, url: e.target.value }))}
                    />
                    <Button
                      onClick={addLink}
                      disabled={addingLink}
                      className="h-11 bg-brand-gradient text-brand-foreground"
                    >
                      <Plus className="size-4" />
                      {addingLink ? "Adding…" : "Add link"}
                    </Button>
                  </div>
                </Card>

                <div className="mt-3 flex flex-col gap-2">
                  {links.length === 0 && (
                    <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      No links yet — add your Instagram, portfolio, or store above.
                    </p>
                  )}
                  {links.map((link, index) => {
                    const draft = getDraft(link)
                    return (
                      <Card key={link.id} className={cn("p-3", !link.is_active && "opacity-50")}>
                        <div className="flex gap-2">
                          <div className="flex flex-col gap-0.5">
                            <button type="button" onClick={() => moveLink(index, -1)} className="rounded p-1 hover:bg-muted" aria-label="Up">
                              <ChevronUp className="size-4" />
                            </button>
                            <button type="button" onClick={() => moveLink(index, 1)} className="rounded p-1 hover:bg-muted" aria-label="Down">
                              <ChevronDown className="size-4" />
                            </button>
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <Input
                              className="h-10"
                              value={draft.title}
                              onChange={(e) =>
                                setDrafts((d) => ({ ...d, [link.id]: { ...draft, title: e.target.value } }))
                              }
                            />
                            <Input
                              className="h-10"
                              value={draft.url}
                              onChange={(e) =>
                                setDrafts((d) => ({ ...d, [link.id]: { ...draft, url: e.target.value } }))
                              }
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => saveLink(link)}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  await apiFetch("/api/links", {
                                    method: "PATCH",
                                    body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
                                  })
                                  await refreshLinks()
                                }}
                              >
                                {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeLink(link.id)}>
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </section>

              {/* Quick theme */}
              <section>
                <h2 className="font-heading text-lg font-semibold">Theme</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyTheme(p.theme)}
                      className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:border-brand"
                    >
                      <span className="size-4 rounded-full" style={{ backgroundColor: p.theme.button }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Live preview — phone frame */}
        <div className="hidden flex-1 items-start justify-center bg-muted/40 p-6 lg:flex lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto">
          <div className="w-full max-w-[340px] overflow-hidden rounded-[2rem] border-[6px] border-foreground/10 bg-background shadow-2xl">
            {previewProfile ? (
              <DbPublicProfileView profile={previewProfile} links={previewLinks} />
            ) : (
              <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
                <p>Your live preview appears here once you launch your page.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile preview strip */}
      {previewProfile && (
        <div className="border-t border-border bg-muted/30 p-4 lg:hidden">
          <p className="mb-2 text-center text-xs font-medium text-muted-foreground">Live preview</p>
          <div className="mx-auto max-h-[50dvh] max-w-sm overflow-hidden rounded-2xl border border-border shadow-lg">
            <DbPublicProfileView profile={previewProfile} links={previewLinks} />
          </div>
        </div>
      )}
    </div>
  )
}

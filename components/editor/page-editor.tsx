"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import {
  EditorHomeLink,
  EditorPanel,
  EditorPreviewFrame,
  EditorSectionTitle,
  EditorShell,
  type EditorTabId,
} from "@/components/editor/editor-shell"
import { ThemePicker } from "@/components/editor/theme-picker"
import {
  BioButton,
  BioGradientButton,
  BioInput,
  BioLabel,
  BioMuted,
  BioTextarea,
} from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import { SITE_DOMAIN } from "@/lib/brand"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbLink, DbProfile, ProfileTheme } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { onboardingThemePresets } from "@/data/onboarding"
import { AnalyticsPanel } from "@/components/editor/analytics-panel"
import { AiPanel } from "@/components/editor/ai-panel"
import { SettingsPanel } from "@/components/editor/settings-panel"
import { cn } from "@/lib/utils"

export function PageEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, links, loading, setProfile, setLinks, refreshLinks } = useDashboard()

  const tab = (searchParams.get("tab") as EditorTabId) || "page"
  const setTab = (next: EditorTabId) =>
    router.replace(next === "page" ? "/editor" : `/editor?tab=${next}`, { scroll: false })

  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [creating, setCreating] = useState(false)
  const [themeId, setThemeId] = useState("basic")
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
      const match = onboardingThemePresets.find(
        (p) => p.theme.bg === profile.theme_json.bg && p.theme.button === profile.theme_json.button,
      )
      if (match) setThemeId(match.id)
    }
  }, [profile])

  const getDraft = useCallback(
    (link: DbLink) => drafts[link.id] ?? { title: link.title, url: link.url },
    [drafts],
  )

  const launchPage = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = sanitizeUsername(username)
    if (!isValidUsername(slug) || !displayName.trim()) {
      toast.error("Enter a valid username and display name")
      return
    }
    getUserId()
    setCreating(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({ username: slug, display_name: displayName.trim(), bio: bio.trim() }),
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
    if (!res.success) toast.error(res.error ?? "Save failed")
    else if (res.data) {
      setProfile(res.data)
      toast.success("Profile updated")
    }
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
    if (!res.success) toast.error(res.error ?? "Could not add link")
    else {
      setNewLink({ title: "", url: "" })
      await refreshLinks()
      toast.success("Link added!")
    }
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

  const applyTheme = async (id: string, theme: ProfileTheme) => {
    if (!profile) return
    setThemeId(id)
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

  const headerActions = (
    <>
      {profile && tab === "page" && (
        <>
          <BioButton
            variant="secondary"
            className="h-9 px-3 py-2 text-xs sm:px-4 sm:text-sm"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`)
              toast.success("Link copied!")
            }}
          >
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </BioButton>
          <BioButton className="h-9 px-3 py-2 text-xs sm:px-4 sm:text-sm" href={`/${profile.username}`}>
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">View live</span>
          </BioButton>
        </>
      )}
      <EditorHomeLink />
    </>
  )

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f7f7f8] text-bio-grey">
        Loading your page…
      </div>
    )
  }

  return (
    <EditorShell tab={tab} onTabChange={setTab} username={profile?.username} actions={headerActions}>
      {tab !== "page" ? (
        <div className="mx-auto max-w-2xl">
          {!profile && tab !== "settings" ? (
            <EditorPanel className="text-center">
              <p className="text-lg font-semibold">Create your page first</p>
              <BioMuted className="mt-1">Set up your link-in-bio, then use stats and AI tools.</BioMuted>
              <BioGradientButton className="mt-5 max-w-xs mx-auto" onClick={() => setTab("page")}>
                Create my page
              </BioGradientButton>
            </EditorPanel>
          ) : (
            <EditorPanel>
              {tab === "analytics" && <AnalyticsPanel />}
              {tab === "ai" && <AiPanel />}
              {tab === "settings" && <SettingsPanel />}
            </EditorPanel>
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-5">
            {!profile ? (
              <EditorPanel>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Claim your link</h1>
                <BioMuted className="mt-2">Set up your page in seconds — preview updates as you go.</BioMuted>
                <form onSubmit={launchPage} className="mt-6 flex flex-col gap-4">
                  <div>
                    <BioLabel>Your link</BioLabel>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-bio-grey-f4 px-4 py-3">
                      <span className="text-sm text-bio-grey">{SITE_DOMAIN}/</span>
                      <input
                        className="min-w-0 flex-1 bg-transparent text-base text-bio-dark outline-none"
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
                      />
                    </div>
                  </div>
                  <div>
                    <BioLabel>Display name</BioLabel>
                    <BioInput className="mt-2 bg-bio-grey-f4 border-transparent focus:border-bio-dark/20" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                  </div>
                  <div>
                    <BioLabel>Bio</BioLabel>
                    <BioTextarea className="mt-2 bg-bio-grey-f4 border-transparent focus:border-bio-dark/20" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What should visitors know about you?" />
                  </div>
                  <BioGradientButton type="submit" disabled={creating}>
                    {creating ? "Creating…" : "Start building"}
                  </BioGradientButton>
                </form>
              </EditorPanel>
            ) : (
              <>
                <EditorPanel>
                  <EditorSectionTitle subtitle="How visitors see you at the top of your page.">Profile</EditorSectionTitle>
                  <div className="flex flex-col gap-3">
                    <input
                      className="h-14 w-full rounded-2xl bg-bio-grey-f4 px-5 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                    <div className="relative">
                      <textarea
                        className="min-h-[100px] w-full resize-none rounded-2xl bg-bio-grey-f4 px-5 py-4 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        maxLength={255}
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-bio-grey">{bio.length}/255</span>
                    </div>
                    <BioButton variant="secondary" className="self-start" onClick={saveProfile}>
                      Save profile
                    </BioButton>
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Add buttons visitors tap on your page.">Links</EditorSectionTitle>
                  <div className="rounded-2xl bg-bio-grey-f4 p-4">
                    <p className="mb-3 text-sm font-semibold text-bio-dark">Add a link</p>
                    <div className="flex flex-col gap-2">
                      <input
                        className="h-12 w-full rounded-xl bg-white px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                        placeholder="Button text (e.g. Instagram)"
                        value={newLink.title}
                        onChange={(e) => setNewLink((l) => ({ ...l, title: e.target.value }))}
                      />
                      <input
                        className="h-12 w-full rounded-xl bg-white px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                        placeholder="https://..."
                        value={newLink.url}
                        onChange={(e) => setNewLink((l) => ({ ...l, url: e.target.value }))}
                      />
                      <BioGradientButton onClick={addLink} disabled={addingLink}>
                        <Plus className="size-4" />
                        {addingLink ? "Adding…" : "Add link"}
                      </BioGradientButton>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {links.length === 0 && (
                      <p className="rounded-2xl border-2 border-dashed border-bio-dark/12 py-8 text-center text-sm text-bio-grey">
                        No links yet — add your Instagram, portfolio, or store above.
                      </p>
                    )}
                    {links.map((link, index) => {
                      const draft = getDraft(link)
                      return (
                        <div
                          key={link.id}
                          className={cn(
                            "rounded-2xl bg-bio-grey-f4 p-4",
                            !link.is_active && "opacity-50",
                          )}
                        >
                          <div className="flex gap-2">
                            <div className="flex flex-col gap-0.5 pt-1">
                              <button type="button" onClick={() => moveLink(index, -1)} className="rounded-lg p-1 hover:bg-white" aria-label="Up">
                                <ChevronUp className="size-4" />
                              </button>
                              <button type="button" onClick={() => moveLink(index, 1)} className="rounded-lg p-1 hover:bg-white" aria-label="Down">
                                <ChevronDown className="size-4" />
                              </button>
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                              <input
                                className="h-11 w-full rounded-xl bg-white px-4 text-sm text-bio-dark outline-none"
                                value={draft.title}
                                onChange={(e) =>
                                  setDrafts((d) => ({ ...d, [link.id]: { ...draft, title: e.target.value } }))
                                }
                              />
                              <input
                                className="h-11 w-full rounded-xl bg-white px-4 text-sm text-bio-dark outline-none"
                                value={draft.url}
                                onChange={(e) =>
                                  setDrafts((d) => ({ ...d, [link.id]: { ...draft, url: e.target.value } }))
                                }
                              />
                              <div className="flex flex-wrap gap-2">
                                <BioButton variant="secondary" className="h-9 px-4 text-xs" onClick={() => saveLink(link)}>
                                  Save
                                </BioButton>
                                <BioButton
                                  variant="secondary"
                                  className="h-9 px-3"
                                  onClick={async () => {
                                    await apiFetch("/api/links", {
                                      method: "PATCH",
                                      body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
                                    })
                                    await refreshLinks()
                                  }}
                                >
                                  {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                                </BioButton>
                                <BioButton
                                  variant="secondary"
                                  className="h-9 px-3 text-bio-red"
                                  onClick={() => removeLink(link.id)}
                                >
                                  <Trash2 className="size-4" />
                                </BioButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Pick a look — same themes as onboarding.">Theme</EditorSectionTitle>
                  <ThemePicker selectedId={themeId} onSelect={applyTheme} />
                </EditorPanel>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-[140px] lg:self-start">
            <EditorPanel className="hidden lg:block">
              <EditorPreviewFrame>
                {previewProfile ? (
                  <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
                ) : (
                  <div className="flex min-h-[480px] items-center justify-center p-6 text-center text-sm text-bio-grey">
                    Preview appears here once you launch your page.
                  </div>
                )}
              </EditorPreviewFrame>
            </EditorPanel>
          </div>
        </div>
      )}

      {tab === "page" && previewProfile && (
        <div className="mt-6 lg:hidden">
          <EditorPanel>
            <EditorPreviewFrame>
              <DbPublicProfileView profile={previewProfile} links={previewLinks} />
            </EditorPreviewFrame>
          </EditorPanel>
        </div>
      )}
    </EditorShell>
  )
}

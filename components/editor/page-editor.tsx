"use client"

import { useState } from "react"
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
  Rocket,
} from "lucide-react"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { useEditor } from "@/components/editor/editor-provider"
import {
  EditorHomeLink,
  EditorPanel,
  EditorPreviewFrame,
  EditorSectionTitle,
  EditorShell,
  type EditorTabId,
} from "@/components/editor/editor-shell"
import { ThemePicker } from "@/components/editor/theme-picker"
import { BioButton, BioGradientButton, BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import type { DbProfile } from "@/lib/database.types"
import { onboardingThemePresets } from "@/data/onboarding"
import { AnalyticsPanel } from "@/components/editor/analytics-panel"
import { AiPanel } from "@/components/editor/ai-panel"
import { SettingsPanel } from "@/components/editor/settings-panel"
import { cn } from "@/lib/utils"

export function PageEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    mode,
    state,
    loading,
    saving,
    profile,
    updateProfile,
    setTheme,
    addLink,
    updateLink,
    removeLink,
    moveLink,
    syncLiveLink,
    deleteLiveLink,
    persistLiveLink,
  } = useEditor()

  const tab = (searchParams.get("tab") as EditorTabId) || "page"
  const setTab = (next: EditorTabId) =>
    router.replace(next === "page" ? "/editor" : `/editor?tab=${next}`, { scroll: false })

  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [addingLink, setAddingLink] = useState(false)

  const canEdit = mode === "draft" || mode === "live"
  const isDraft = mode === "draft"

  const themeId =
    onboardingThemePresets.find(
      (p) =>
        state &&
        p.theme.bg === state.profile.theme.bg &&
        p.theme.button === state.profile.theme.button,
    )?.id ??
    state?.template_id ??
    "creator"

  const previewProfile: DbProfile | null = state
    ? {
        id: profile?.id ?? "preview",
        username: profile?.username ?? "preview",
        display_name: state.profile.display_name || "Your Name",
        bio: state.profile.bio || null,
        avatar_url: state.profile.avatar_url,
        theme_json: state.profile.theme,
        template_id: state.template_id,
        created_at: profile?.created_at ?? new Date().toISOString(),
      }
    : null

  const previewLinks = (state?.links ?? [])
    .filter((l) => l.is_active)
    .map((l) => ({ id: l.id, title: l.title, url: l.url }))

  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Enter a title and URL")
      return
    }
    if (isDraft) {
      addLink(newLink.title.trim(), newLink.url.trim())
      setNewLink({ title: "", url: "" })
      toast.success("Link added!")
      return
    }
    setAddingLink(true)
    await persistLiveLink(newLink.title.trim(), newLink.url.trim())
    setAddingLink(false)
    setNewLink({ title: "", url: "" })
    toast.success("Link added!")
  }

  const handleRemoveLink = async (id: string) => {
    if (isDraft) {
      removeLink(id)
      return
    }
    await deleteLiveLink(id)
  }

  const handleMoveLink = async (index: number, dir: -1 | 1) => {
    moveLink(index, dir)
    if (!isDraft && state) {
      const next = index + dir
      if (next < 0 || next >= state.links.length) return
      const reordered = [...state.links]
      ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
      await apiFetch("/api/links", {
        method: "PATCH",
        body: JSON.stringify({
          links: reordered.map((l, i) => ({ id: l.id, position: i })),
        }),
      })
    }
  }

  const headerActions = (
    <>
      {saving && (
        <span className="hidden text-xs text-bio-grey sm:inline">Saving…</span>
      )}
      {isDraft && tab === "page" && (
        <BioGradientButton className="h-9 px-4 text-xs sm:text-sm" href="/claim">
          <Rocket className="size-4" />
          <span className="hidden sm:inline">Go live</span>
        </BioGradientButton>
      )}
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
        Loading editor…
      </div>
    )
  }

  return (
    <EditorShell tab={tab} onTabChange={setTab} username={profile?.username} actions={headerActions}>
      {tab !== "page" ? (
        <div className="mx-auto max-w-2xl">
          {!canEdit && tab !== "settings" ? (
            <EditorPanel className="text-center">
              <p className="text-lg font-semibold">Pick a template first</p>
              <BioMuted className="mt-1">Choose a layout on the homepage, then customize here.</BioMuted>
              <BioGradientButton className="mx-auto mt-5 max-w-xs" href="/#templates">
                Browse templates
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
            {!canEdit ? (
              <EditorPanel className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Start with a template</h1>
                <BioMuted className="mt-2">
                  Templates are JSON layouts — pick one, edit everything, then claim your link.
                </BioMuted>
                <BioGradientButton className="mx-auto mt-6 max-w-xs" href="/#templates">
                  Choose a template
                </BioGradientButton>
              </EditorPanel>
            ) : (
              <>
                {isDraft && (
                  <EditorPanel className="border border-bio-dark/8 bg-white">
                    <p className="text-sm text-bio-grey">
                      <span className="font-semibold capitalize text-bio-dark">{state?.template_id}</span> template
                      · autosaves every second
                    </p>
                    <BioGradientButton className="mt-3 max-w-xs" href="/claim">
                      <Rocket className="size-4" />
                      Claim username & go live
                    </BioGradientButton>
                  </EditorPanel>
                )}

                <EditorPanel>
                  <EditorSectionTitle subtitle="Name and bio at the top of your page.">Profile</EditorSectionTitle>
                  <div className="flex flex-col gap-3">
                    <input
                      className="h-14 w-full rounded-2xl bg-bio-grey-f4 px-5 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                      value={state?.profile.display_name ?? ""}
                      onChange={(e) => updateProfile({ display_name: e.target.value })}
                      placeholder="Your name"
                    />
                    <div className="relative">
                      <textarea
                        className="min-h-[100px] w-full resize-none rounded-2xl bg-bio-grey-f4 px-5 py-4 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                        value={state?.profile.bio ?? ""}
                        onChange={(e) => updateProfile({ bio: e.target.value })}
                        placeholder="Bio"
                        maxLength={255}
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-bio-grey">
                        {(state?.profile.bio ?? "").length}/255
                      </span>
                    </div>
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Buttons visitors tap on your page.">Links</EditorSectionTitle>
                  <div className="rounded-2xl bg-bio-grey-f4 p-4">
                    <div className="flex flex-col gap-2">
                      <input
                        className="h-12 w-full rounded-xl bg-white px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                        placeholder="Button text"
                        value={newLink.title}
                        onChange={(e) => setNewLink((l) => ({ ...l, title: e.target.value }))}
                      />
                      <input
                        className="h-12 w-full rounded-xl bg-white px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                        placeholder="https://..."
                        value={newLink.url}
                        onChange={(e) => setNewLink((l) => ({ ...l, url: e.target.value }))}
                      />
                      <BioGradientButton onClick={handleAddLink} disabled={addingLink}>
                        <Plus className="size-4" />
                        {addingLink ? "Adding…" : "Add link"}
                      </BioGradientButton>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {(state?.links ?? []).map((link, index) => (
                      <div
                        key={link.id}
                        className={cn("rounded-2xl bg-bio-grey-f4 p-4", !link.is_active && "opacity-50")}
                      >
                        <div className="flex gap-2">
                          <div className="flex flex-col gap-0.5 pt-1">
                            <button type="button" onClick={() => handleMoveLink(index, -1)} className="rounded-lg p-1 hover:bg-white" aria-label="Up">
                              <ChevronUp className="size-4" />
                            </button>
                            <button type="button" onClick={() => handleMoveLink(index, 1)} className="rounded-lg p-1 hover:bg-white" aria-label="Down">
                              <ChevronDown className="size-4" />
                            </button>
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <input
                              className="h-11 w-full rounded-xl bg-white px-4 text-sm outline-none"
                              value={link.title}
                              onChange={(e) => updateLink(link.id, { title: e.target.value })}
                              onBlur={() => !isDraft && syncLiveLink(link.id)}
                            />
                            <input
                              className="h-11 w-full rounded-xl bg-white px-4 text-sm outline-none"
                              value={link.url}
                              onChange={(e) => updateLink(link.id, { url: e.target.value })}
                              onBlur={() => !isDraft && syncLiveLink(link.id)}
                            />
                            <div className="flex gap-2">
                              <BioButton
                                variant="secondary"
                                className="h-9 px-3"
                                onClick={() => updateLink(link.id, { is_active: !link.is_active })}
                              >
                                {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                              </BioButton>
                              <BioButton
                                variant="secondary"
                                className="h-9 px-3 text-bio-red"
                                onClick={() => handleRemoveLink(link.id)}
                              >
                                <Trash2 className="size-4" />
                              </BioButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="JSON-driven theme from your template.">Theme</EditorSectionTitle>
                  <ThemePicker
                    selectedId={themeId}
                    onSelect={(id, theme) => setTheme(theme)}
                  />
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
                    Pick a template to preview.
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
              <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
            </EditorPreviewFrame>
          </EditorPanel>
        </div>
      )}
    </EditorShell>
  )
}

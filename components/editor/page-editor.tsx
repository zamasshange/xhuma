"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  Plus,
  ExternalLink,
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
import { BioButton, BioGradientButton, BioInput, BioMuted, BioTextarea } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import type { DbProfile } from "@/lib/database.types"
import { onboardingThemePresets } from "@/data/onboarding"
import { getThemePreset } from "@/lib/theme-presets"
import { AnalyticsPanel } from "@/components/editor/analytics-panel"
import { AiPanel } from "@/components/editor/ai-panel"
import { SettingsPanel } from "@/components/editor/settings-panel"
import { LinkEditorRow } from "@/components/editor/link-editor-row"
import { QuickPlatformChips } from "@/components/editor/quick-platform-chips"
import { AvatarUpload } from "@/components/editor/avatar-upload"
import type { SocialIconName } from "@/lib/infer-link-icon"

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
    state?.profile.theme.preset_id ??
    onboardingThemePresets.find(
      (p) =>
        state &&
        p.theme.bg === state.profile.theme.bg &&
        p.theme.button === state.profile.theme.button,
    )?.id ??
    state?.template_id ??
    "creator"

  const themeParam = searchParams.get("theme")

  useEffect(() => {
    if (!themeParam || mode !== "draft" || !state) return
    const preset = getThemePreset(themeParam)
    if (preset && state.profile.theme.preset_id !== themeParam) {
      setTheme(preset.theme)
    }
  }, [themeParam, mode, state, setTheme])

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
    .map((l) => ({ id: l.id, title: l.title, url: l.url, icon: l.icon }))

  const handleQuickAdd = (title: string, url: string, icon: SocialIconName) => {
    if (isDraft) {
      addLink(title, url, icon)
      toast.success(`${title} added!`)
      return
    }
    void persistLiveLink(title, url, icon)
    toast.success(`${title} added!`)
  }

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
                  <EditorPanel>
                    <p className="text-sm text-bio-grey">
                      <span className="rounded-full bg-bio-grey-f4 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-bio-dark">
                        {state?.template_id}
                      </span>
                      <span className="ml-2">template · autosaves every second</span>
                    </p>
                    <BioGradientButton className="mt-4 max-w-xs" href="/claim">
                      <Rocket className="size-4" />
                      Claim username & go live
                    </BioGradientButton>
                  </EditorPanel>
                )}

                <EditorPanel>
                  <EditorSectionTitle subtitle="Photo, name and bio at the top of your page.">
                    Profile
                  </EditorSectionTitle>
                  <AvatarUpload
                    avatarUrl={state?.profile.avatar_url ?? null}
                    displayName={state?.profile.display_name ?? ""}
                    onUploaded={(url) => updateProfile({ avatar_url: url })}
                  />
                  <div className="mt-5 flex flex-col gap-3 border-t border-bio-dark/6 pt-5">
                    <BioInput
                      value={state?.profile.display_name ?? ""}
                      onChange={(e) => updateProfile({ display_name: e.target.value })}
                      placeholder="Your name"
                    />
                    <div className="relative">
                      <BioTextarea
                        className="min-h-[100px]"
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
                  <QuickPlatformChips onAdd={handleQuickAdd} />
                  <div className="mt-4 rounded-2xl bg-bio-grey-f4 p-4">
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
                      <LinkEditorRow
                        key={link.id}
                        link={link}
                        index={index}
                        total={state?.links.length ?? 0}
                        onUpdate={(patch) => updateLink(link.id, patch)}
                        onMove={(dir) => handleMoveLink(index, dir)}
                        onRemove={() => handleRemoveLink(link.id)}
                        onBlur={() => !isDraft && syncLiveLink(link.id)}
                      />
                    ))}
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Same themes as the homepage gallery — background updates live.">
                    Theme
                  </EditorSectionTitle>
                  <ThemePicker
                    selectedId={themeId}
                    onSelect={(id, theme) => setTheme(theme)}
                  />
                </EditorPanel>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-[140px] lg:self-start">
            <EditorPanel className="hidden lg:block !p-4">
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
          <EditorPanel className="!p-4">
            <EditorPreviewFrame>
              <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
            </EditorPreviewFrame>
          </EditorPanel>
        </div>
      )}
    </EditorShell>
  )
}

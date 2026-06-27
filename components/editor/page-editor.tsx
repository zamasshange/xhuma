"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { UserButton } from "@clerk/nextjs"
import {
  Plus,
  ExternalLink,
  Share2,
  Rocket,
  Sparkles,
} from "lucide-react"
import { AiAssistantDock } from "@/components/ai/ai-assistant-dock"
import { AiDelightHints } from "@/components/ai/ai-delight-hints"
import { AiLinkRecommendations } from "@/components/ai/ai-link-recommendations"
import { AiOnboardingModal } from "@/components/ai/ai-onboarding-modal"
import { AiPublishReview } from "@/components/ai/ai-publish-review"
import { AiThemeAssistant } from "@/components/ai/ai-theme-assistant"
import { ImproveWithAi } from "@/components/ai/improve-with-ai"
import { ProfileHealthCard } from "@/components/ai/profile-health-card"
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
import { getThemePreset, resolveThemeBackground } from "@/lib/theme-presets"
import { AnalyticsPanel } from "@/components/editor/analytics-panel"
import { AiPanel } from "@/components/editor/ai-panel"
import { SettingsPanel } from "@/components/editor/settings-panel"
import { LinkEditorRow } from "@/components/editor/link-editor-row"
import { QuickPlatformChips } from "@/components/editor/quick-platform-chips"
import { AvatarUpload } from "@/components/editor/avatar-upload"
import { LinkStylePicker } from "@/components/editor/link-style-picker"
import { LinkColorPicker } from "@/components/editor/link-color-picker"
import { resolveLinkCardStyle } from "@/lib/link-card-styles"
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
  const [showPublishReview, setShowPublishReview] = useState(false)
  const [showAiOnboarding, setShowAiOnboarding] = useState(false)
  const [publishHref, setPublishHref] = useState("/claim")

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

  useEffect(() => {
    if (!canEdit || mode !== "draft" || !state) return
    const skipped = localStorage.getItem("xhuma-ai-onboarding-skipped")
    const done = localStorage.getItem("xhuma-ai-onboarding-done")
    const isEmpty =
      !state.profile.display_name &&
      !state.profile.bio &&
      state.links.filter((l) => l.title.trim()).length === 0
    if (isEmpty && !skipped && !done) {
      setShowAiOnboarding(true)
    }
  }, [canEdit, mode, state])

  const handleGoLive = (href: string) => {
    setPublishHref(href)
    setShowPublishReview(true)
  }

  const previewProfile: DbProfile | null = state
    ? {
        id: profile?.id ?? "preview",
        username: profile?.username ?? "preview",
        display_name: state.profile.display_name || "Your Name",
        bio: state.profile.bio || null,
        avatar_url: state.profile.avatar_url || null,
        theme_json: resolveThemeBackground(state.profile.theme),
        template_id: state.template_id,
        created_at: profile?.created_at ?? new Date().toISOString(),
      }
    : null

  const previewLinks = (state?.links ?? [])
    .filter((l) => l.is_active !== false && l.title.trim())
    .map((l) => ({ id: l.id, title: l.title, url: l.url || "#", icon: l.icon }))

  const handleQuickAdd = async (title: string, url: string, icon: SocialIconName) => {
    if (isDraft) {
      addLink(title, url, icon)
      toast.success(`${title} added!`)
      return
    }
    const ok = await persistLiveLink(title, url, icon)
    if (ok) toast.success(`${title} added!`)
    else toast.error(`Could not save ${title} — still visible in preview. Edit the URL and try again.`)
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
    const ok = await persistLiveLink(newLink.title.trim(), newLink.url.trim())
    setAddingLink(false)
    if (!ok) {
      toast.error("Could not add link")
      return
    }
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
        <BioGradientButton
          className="h-9 px-4 text-xs sm:text-sm"
          onClick={() => handleGoLive("/claim")}
        >
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
      <UserButton
        afterSignOutUrl="/"
        appearance={{ elements: { avatarBox: "size-8 ring-2 ring-bio-dark/10" } }}
      />
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
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
                <ProfileHealthCard />

                {isDraft && (
                  <EditorPanel>
                    <button
                      type="button"
                      onClick={() => setShowAiOnboarding(true)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-bio-dark/15 bg-bio-grey-f4/50 px-4 py-3 text-left transition-colors hover:border-bio-dark/25"
                    >
                      <div>
                        <p className="text-sm font-semibold text-bio-dark">Set up with AI</p>
                        <BioMuted className="text-xs">Answer a few questions — we&apos;ll draft your page.</BioMuted>
                      </div>
                      <Sparkles className="size-5 shrink-0 text-bio-dark" />
                    </button>
                  </EditorPanel>
                )}

                {isDraft && (
                  <EditorPanel>
                    <p className="text-sm text-bio-grey">
                      <span className="rounded-full bg-bio-grey-f4 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-bio-dark">
                        {state?.template_id}
                      </span>
                      <span className="ml-2">template · autosaves every second</span>
                    </p>
                    <BioGradientButton className="mt-4 max-w-xs" onClick={() => handleGoLive("/claim")}>
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
                    onPreviewChange={(url) => updateProfile({ avatar_url: url })}
                    onUploaded={(url) => updateProfile({ avatar_url: url })}
                  />
                  <div className="mt-5 flex flex-col gap-3 border-t border-bio-dark/6 pt-5">
                    <div className="flex items-center gap-2">
                      <BioInput
                        className="flex-1"
                        value={state?.profile.display_name ?? ""}
                        onChange={(e) => updateProfile({ display_name: e.target.value })}
                        placeholder="Your name"
                      />
                      <ImproveWithAi
                        field="display_name"
                        text={state?.profile.display_name ?? ""}
                        onApply={(display_name) => updateProfile({ display_name })}
                      />
                    </div>
                    <div className="relative">
                      <BioTextarea
                        className="min-h-[100px]"
                        value={state?.profile.bio ?? ""}
                        onChange={(e) => updateProfile({ bio: e.target.value })}
                        placeholder="Bio"
                        maxLength={255}
                      />
                      <div className="absolute bottom-3 left-3">
                        <ImproveWithAi
                          field="bio"
                          text={state?.profile.bio ?? ""}
                          context={state?.profile.display_name}
                          compact
                          onApply={(bio) => updateProfile({ bio })}
                        />
                      </div>
                      <span className="absolute bottom-3 right-4 text-xs text-bio-grey">
                        {(state?.profile.bio ?? "").length}/255
                      </span>
                    </div>
                  </div>
                  <AiDelightHints />
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Buttons visitors tap on your page.">Links</EditorSectionTitle>
                  <QuickPlatformChips onAdd={handleQuickAdd} />
                  <div className="mt-4 rounded-xl border border-bio-dark/6 bg-bio-grey-f4 p-4">
                    <div className="flex flex-col gap-2">
                      <BioInput
                        placeholder="Button text"
                        value={newLink.title}
                        onChange={(e) => setNewLink((l) => ({ ...l, title: e.target.value }))}
                      />
                      <BioInput
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
                  <div className="mt-4">
                    <AiLinkRecommendations />
                  </div>
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Shape and feel of your link buttons.">
                    Link style
                  </EditorSectionTitle>
                  <LinkStylePicker
                    value={resolveLinkCardStyle(state?.profile.theme ?? { bg: "", text: "", button: "", radius: "14px" })}
                    onChange={(link_style) =>
                      setTheme({ ...state!.profile.theme, link_style })
                    }
                  />
                  <LinkColorPicker
                    theme={state?.profile.theme ?? { bg: "", text: "", button: "#0d0c22", button_text: "#ffffff", radius: "14px" }}
                    onChange={(patch) => setTheme({ ...state!.profile.theme, ...patch })}
                  />
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Describe your vibe — AI picks matching colours.">
                    AI Theme
                  </EditorSectionTitle>
                  <AiThemeAssistant />
                </EditorPanel>

                <EditorPanel>
                  <EditorSectionTitle subtitle="Same themes as the homepage gallery — background updates live.">
                    Theme
                  </EditorSectionTitle>
                  <ThemePicker
                    selectedId={themeId}
                    onSelect={(_id, theme) =>
                      setTheme({
                        ...theme,
                        link_style:
                          state?.profile.theme.link_style ??
                          resolveLinkCardStyle(state?.profile.theme ?? theme),
                      })
                    }
                  />
                </EditorPanel>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-[112px] lg:max-h-[calc(100vh-6.5rem)] lg:self-start">
            <div className="hidden lg:block">
              <EditorPreviewFrame>
                {previewProfile ? (
                  <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
                ) : (
                  <div className="flex min-h-[280px] items-center justify-center p-4 text-center text-xs text-bio-grey">
                    Pick a template to preview.
                  </div>
                )}
              </EditorPreviewFrame>
            </div>
          </div>
        </div>
      )}

      {tab === "page" && previewProfile && (
        <div className="mt-6 flex justify-center lg:hidden">
          <EditorPreviewFrame>
            <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
          </EditorPreviewFrame>
        </div>
      )}

      {tab === "page" && canEdit && <AiAssistantDock tab={tab} />}

      <AiOnboardingModal
        open={showAiOnboarding}
        onClose={() => {
          setShowAiOnboarding(false)
          localStorage.setItem("xhuma-ai-onboarding-skipped", "1")
        }}
      />

      <AiPublishReview
        open={showPublishReview}
        onClose={() => setShowPublishReview(false)}
        onContinue={() => {
          setShowPublishReview(false)
          localStorage.setItem("xhuma-ai-onboarding-done", "1")
          router.push(publishHref)
        }}
      />
    </EditorShell>
  )
}

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, Plus } from "lucide-react"
import { toast } from "sonner"
import { ScaledPhonePreview } from "@/components/device/scaled-phone-preview"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import {
  ContinueButton,
  OnboardingShell,
  OnboardingTitle,
  PlatformOption,
} from "@/components/onboarding/onboarding-shell"
import { PlatformIcon } from "@/components/onboarding/platform-icons"
import { ThemePreviewImage } from "@/components/themes/theme-preview-image"
import {
  ONBOARDING_STEPS,
  onboardingPlatformsExtra,
  onboardingPlatformsPrimary,
  onboardingThemePresets,
  platformById,
  type OnboardingStep,
} from "@/data/onboarding"
import { apiFetch } from "@/lib/api-fetch"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbProfile, ProfileTheme } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { cn } from "@/lib/utils"
import { SITE_DOMAIN } from "@/lib/brand"
import { LinkDraftRow } from "@/components/onboarding/link-draft-row"
import { SocialIconBadge } from "@/components/icons/social-icon"
import { inferLinkIcon } from "@/lib/infer-link-icon"

type LinkDraft = { title: string; url: string }

export function OnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [stepIndex, setStepIndex] = useState(0)
  const [username, setUsername] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [themeId, setThemeId] = useState(onboardingThemePresets[0]?.id ?? "basic")
  const [theme, setTheme] = useState<ProfileTheme>(() =>
    resolveThemeBackground(onboardingThemePresets[0]?.theme ?? DEFAULT_THEME),
  )
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [links, setLinks] = useState<LinkDraft[]>([{ title: "", url: "" }])
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const step = ONBOARDING_STEPS[stepIndex] as OnboardingStep
  const totalSteps = ONBOARDING_STEPS.length

  useEffect(() => {
    const fromUrl = searchParams.get("username")
    if (fromUrl) {
      const slug = sanitizeUsername(fromUrl)
      setUsername(slug)
      setDisplayName((prev) => prev || displayNameFromUsername(slug))
    }
  }, [searchParams])

  useEffect(() => {
    if (platforms.length === 0) return
    setSocialUrls((prev) => {
      const next = { ...prev }
      for (const id of platforms) {
        if (!(id in next)) next[id] = ""
      }
      return next
    })
  }, [platforms])

  const togglePlatform = (id: string) => {
    setPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const selectTheme = (id: string) => {
    const preset = onboardingThemePresets.find((t) => t.id === id)
    if (!preset) return
    setThemeId(id)
    setTheme(resolveThemeBackground(preset.theme))
  }

  const handleAvatar = (file: File | null) => {
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const goNext = () => setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const canContinue = useMemo(() => {
    switch (step) {
      case "platforms":
      case "platforms-extra":
        return true
      case "theme":
        return !!themeId
      case "avatar":
        return true
      case "profile":
        return displayName.trim().length > 0 && isValidUsername(username)
      case "links":
        return true
      case "preview":
        return true
      default:
        return true
    }
  }, [step, themeId, displayName, username])

  const finishOnboarding = useCallback(async () => {
    if (!isValidUsername(username)) {
      toast.error("Invalid username")
      return
    }
    setSaving(true)

    let avatarUrl: string | null = null
    if (avatarFile) {
      const form = new FormData()
      form.append("file", avatarFile)
      const uploadRes = await apiFetch<{ url: string }>("/api/upload/avatar", {
        method: "POST",
        body: form,
        headers: {},
      })
      if (uploadRes.success && uploadRes.data?.url) avatarUrl = uploadRes.data.url
    }

    const profileRes = await apiFetch<DbProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify({
        username,
        display_name: displayName.trim(),
        bio: bio.trim(),
      }),
    })

    if (!profileRes.success && !profileRes.error?.includes("Profile already exists")) {
      setSaving(false)
      toast.error(profileRes.error ?? "Could not create your page")
      return
    }

    await apiFetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        theme: resolveThemeBackground(theme),
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        display_name: displayName.trim(),
        bio: bio.trim(),
      }),
    })

    const linkItems: { title: string; url: string; icon?: string }[] = []
    for (const l of links) {
      if (l.title.trim() && l.url.trim()) {
        linkItems.push({
          title: l.title.trim(),
          url: l.url.trim(),
          icon: inferLinkIcon(l.title, l.url) ?? undefined,
        })
      }
    }
    for (const id of platforms) {
      const url = socialUrls[id]?.trim()
      const p = platformById(id)
      if (url && p?.linkTitle) linkItems.push({ title: p.linkTitle, url, icon: p.icon })
    }

    for (const link of linkItems) {
      const res = await apiFetch("/api/links", {
        method: "POST",
        body: JSON.stringify({
          ...link,
          icon: "icon" in link ? link.icon : inferLinkIcon(link.title, link.url),
        }),
      })
      if (!res.success) {
        setSaving(false)
        toast.error(res.error ?? `Could not add link: ${link.title}`)
        return
      }
    }

    setSaving(false)
    toast.success("Your page is live!")
    router.push("/editor")
  }, [avatarFile, bio, displayName, links, platforms, router, socialUrls, theme, username])

  const handleContinue = () => {
    if (step === "preview") {
      void finishOnboarding()
      return
    }
    goNext()
  }

  const previewProfile: DbProfile = {
    id: "preview",
    username: username || "you",
    display_name: displayName || "Your Name",
    bio: bio || null,
    avatar_url: avatarPreview,
    theme_json: resolveThemeBackground(theme),
    created_at: new Date().toISOString(),
  }

  const previewLinks = useMemo(
    () => [
      ...links
        .filter((l) => l.title && l.url)
        .map((l, i) => ({
          id: `draft-${i}`,
          title: l.title,
          url: l.url,
          icon: inferLinkIcon(l.title, l.url) ?? undefined,
        })),
      ...platforms
        .map((id) => {
          const p = platformById(id)
          const url = socialUrls[id]
          return p && url ? { id, title: p.linkTitle ?? p.label, url, icon: p.icon } : null
        })
        .filter(Boolean) as { id: string; title: string; url: string; icon?: string }[],
    ],
    [links, platforms, socialUrls],
  )

  return (
    <OnboardingShell
      step={stepIndex + 1}
      totalSteps={totalSteps}
      onBack={stepIndex > 0 ? goBack : undefined}
      contentClassName={step === "preview" ? "min-h-0 overflow-hidden" : undefined}
      footer={
        <ContinueButton disabled={!canContinue || saving} onClick={handleContinue}>
          {saving ? "Launching…" : "Continue"}
        </ContinueButton>
      }
    >
      {step === "platforms" && (
        <>
          <OnboardingTitle>Which platforms are you on?</OnboardingTitle>
          <div className="flex flex-col gap-3">
            {onboardingPlatformsPrimary.map((p) => (
              <PlatformOption
                key={p.id}
                label={p.label}
                icon={<PlatformIcon name={p.icon} />}
                selected={platforms.includes(p.id)}
                onClick={() => togglePlatform(p.id)}
              />
            ))}
          </div>
        </>
      )}

      {step === "platforms-extra" && (
        <>
          <OnboardingTitle>Anything else?</OnboardingTitle>
          <div className="flex flex-col gap-3">
            {onboardingPlatformsExtra.map((p) => (
              <PlatformOption
                key={p.id}
                label={p.label}
                icon={<PlatformIcon name={p.icon} />}
                selected={platforms.includes(p.id)}
                onClick={() => togglePlatform(p.id)}
              />
            ))}
          </div>
        </>
      )}

      {step === "theme" && (
        <>
          <OnboardingTitle subtitle="Tap a style — you can change it anytime in the editor.">
            Select a theme
          </OnboardingTitle>
          <div className="grid grid-cols-3 gap-2.5 pb-2 sm:gap-3">
            {onboardingThemePresets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t.id)}
                className={cn(
                  "rounded-2xl p-1 text-left transition-all",
                  themeId === t.id
                    ? "bg-white ring-2 ring-bio-dark shadow-md"
                    : "hover:bg-white/80",
                )}
              >
                <ThemePreviewImage src={t.image} alt={t.name} compact />
                <p className="mt-1.5 truncate px-0.5 text-center text-[11px] font-medium text-bio-dark sm:text-xs">
                  {t.name}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "avatar" && (
        <>
          <OnboardingTitle>Upload your profile picture</OnboardingTitle>
          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-40 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-bio-grey-d9 bg-white transition-colors hover:border-bio-dark/30"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Preview" className="size-full object-cover" />
              ) : (
                <Camera className="size-10 text-bio-grey" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
            />
            <p className="mt-4 text-sm text-bio-grey">Tap to upload — you can skip this step</p>
          </div>
        </>
      )}

      {step === "profile" && (
        <>
          <OnboardingTitle>Add your profile details</OnboardingTitle>
          <div className="flex flex-col gap-4">
            {!searchParams.get("username") && (
              <input
                className="h-14 w-full rounded-2xl bg-bio-grey-f4 px-5 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                placeholder={`Username (${SITE_DOMAIN}/you)`}
                value={username}
                onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
              />
            )}
            <input
              className="h-14 w-full rounded-2xl bg-bio-grey-f4 px-5 text-base text-bio-dark outline-none placeholder:text-bio-grey"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <div className="relative">
              <textarea
                className="min-h-[140px] w-full resize-none rounded-2xl bg-bio-grey-f4 px-5 py-4 text-base text-bio-dark outline-none placeholder:text-bio-grey"
                placeholder="Bio"
                maxLength={255}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <span className="absolute bottom-3 right-4 text-xs text-bio-grey">{bio.length}/255</span>
            </div>
          </div>
        </>
      )}

      {step === "links" && (
        <>
          <OnboardingTitle subtitle="Add anything you want your followers to see.">
            Start with a link
          </OnboardingTitle>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            {links.map((link, i) => (
              <LinkDraftRow
                key={i}
                title={link.title}
                url={link.url}
                onTitleChange={(title) =>
                  setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, title } : l)))
                }
                onUrlChange={(url) =>
                  setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, url } : l)))
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setLinks((prev) => [...prev, { title: "", url: "" }])}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-bio-dark/12 bg-white py-3 text-sm font-semibold text-bio-dark hover:bg-bio-grey-f4"
            >
              <Plus className="size-4" />
              Add another
            </button>
          </div>

          {platforms.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-bio-dark">Socials</p>
              <div className="flex flex-col gap-3">
                {platforms.map((id) => {
                  const p = platformById(id)
                  if (!p) return null
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-2xl border-2 border-bio-dark/10 bg-white px-4 py-3 shadow-sm">
                      <SocialIconBadge icon={p.icon} size={40} />
                      <input
                        className="min-w-0 flex-1 bg-transparent text-base text-bio-dark outline-none placeholder:text-bio-grey"
                        placeholder={p.urlPlaceholder ?? "URL"}
                        value={socialUrls[id] ?? ""}
                        onChange={(e) => setSocialUrls((prev) => ({ ...prev, [id]: e.target.value }))}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {step === "preview" && (
        <>
          <OnboardingTitle compact>Looking Good!</OnboardingTitle>
          <div className="mx-auto flex h-full min-h-0 w-full max-w-[min(78vw,250px)] flex-1 items-center justify-center">
              <ScaledPhonePreview>
                <DbPublicProfileView profile={previewProfile} links={previewLinks} density="device" />
              </ScaledPhonePreview>
          </div>
        </>
      )}
    </OnboardingShell>
  )
}

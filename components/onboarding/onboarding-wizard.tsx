"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, Plus } from "lucide-react"
import { toast } from "sonner"
import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
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
import { getUserId } from "@/lib/temp-user"
import { displayNameFromUsername, isValidUsername, sanitizeUsername } from "@/lib/username"
import type { DbProfile, ProfileTheme } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"

type LinkDraft = { title: string; url: string }

export function OnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [stepIndex, setStepIndex] = useState(0)
  const [username, setUsername] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [themeId, setThemeId] = useState(onboardingThemePresets[0]?.id ?? "basic")
  const [theme, setTheme] = useState<ProfileTheme>(onboardingThemePresets[0]?.theme ?? DEFAULT_THEME)
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
    getUserId()
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
    setTheme(preset.theme)
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
    getUserId()

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
        theme,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        display_name: displayName.trim(),
        bio: bio.trim(),
      }),
    })

    const linkItems: LinkDraft[] = []
    for (const l of links) {
      if (l.title.trim() && l.url.trim()) linkItems.push({ title: l.title.trim(), url: l.url.trim() })
    }
    for (const id of platforms) {
      const url = socialUrls[id]?.trim()
      const p = platformById(id)
      if (url && p?.linkTitle) linkItems.push({ title: p.linkTitle, url })
    }

    for (const link of linkItems) {
      await apiFetch("/api/links", {
        method: "POST",
        body: JSON.stringify(link),
      })
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
    theme_json: theme,
    created_at: new Date().toISOString(),
  }

  const previewLinks = [
    ...links.filter((l) => l.title && l.url),
    ...platforms
      .map((id) => {
        const p = platformById(id)
        const url = socialUrls[id]
        return p && url ? { id, title: p.linkTitle ?? p.label, url } : null
      })
      .filter(Boolean) as { id: string; title: string; url: string }[],
  ]

  return (
    <OnboardingShell step={stepIndex + 1} totalSteps={totalSteps} onBack={stepIndex > 0 ? goBack : undefined}>
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
          <OnboardingTitle>Select a theme</OnboardingTitle>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {onboardingThemePresets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t.id)}
                className={cn(
                  "text-left transition-transform hover:scale-[1.02]",
                  themeId === t.id && "rounded-2xl ring-2 ring-bio-dark ring-offset-2",
                )}
              >
                <div className="rounded-2xl shadow-[0_4px_20px_rgba(13,12,34,0.06)]">
                  <ThemePreviewImage src={t.image} alt={t.name} />
                </div>
                <p className="mt-2 text-center text-xs font-medium text-bio-dark sm:text-sm">
                  {t.name}
                  {t.live && <span className="text-bio-grey"> · Live</span>}
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
                placeholder="Username (xhuma.io/you)"
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
              <div key={i} className="mb-3 flex flex-col gap-2 last:mb-0">
                <input
                  className="h-12 w-full rounded-xl bg-bio-grey-f4 px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                  placeholder="Link name"
                  value={link.title}
                  onChange={(e) =>
                    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, title: e.target.value } : l)))
                  }
                />
                <input
                  className="h-12 w-full rounded-xl bg-bio-grey-f4 px-4 text-bio-dark outline-none placeholder:text-bio-grey"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, url: e.target.value } : l)))
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLinks((prev) => [...prev, { title: "", url: "" }])}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-sky-50 py-3 text-sm font-semibold text-sky-600"
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
                    <div key={id} className="flex items-center gap-3 rounded-2xl border-2 border-bio-dark/10 bg-white px-4 py-3">
                      <PlatformIcon name={p.icon} />
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
          <OnboardingTitle>Looking Good!</OnboardingTitle>
          <div className="flex flex-1 items-center justify-center py-4">
            <PhoneDeviceFrame size="md" showLabel={false}>
              <DbPublicProfileView profile={previewProfile} links={previewLinks} compact />
            </PhoneDeviceFrame>
          </div>
        </>
      )}

      <ContinueButton disabled={!canContinue || saving} onClick={handleContinue}>
        {saving ? "Launching…" : step === "preview" ? "Continue" : "Continue"}
      </ContinueButton>
    </OnboardingShell>
  )
}

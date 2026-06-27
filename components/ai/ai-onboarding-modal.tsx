"use client"

import { useState } from "react"
import { ChevronRight, Loader2, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioGradientButton, BioInput, BioMuted, BioTextarea } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { getThemePreset, resolveThemeBackground } from "@/lib/theme-presets"
import { inferLinkIcon } from "@/lib/infer-link-icon"

const STEPS = [
  { key: "role", label: "What do you do?", placeholder: "e.g. Wedding photographer in Cape Town" },
  { key: "audience", label: "Who is your audience?", placeholder: "e.g. Engaged couples & brands" },
  { key: "goal", label: "What are you trying to achieve?", placeholder: "e.g. Get more bookings" },
  { key: "platforms", label: "What social platforms do you use?", placeholder: "e.g. Instagram, WhatsApp, TikTok" },
  { key: "style", label: "What style best describes your brand?", placeholder: "e.g. Luxury, minimal, playful" },
  { key: "country", label: "What country are you in?", placeholder: "South Africa" },
] as const

type Props = {
  open: boolean
  onClose: () => void
}

export function AiOnboardingModal({ open, onClose }: Props) {
  const { updateProfile, setTheme, addLink, persistLiveLink, mode } = useEditor()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({ country: "South Africa" })
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const finish = async () => {
    setLoading(true)
    const res = await apiFetch<{
      setup: {
        display_names: string[]
        bio: string
        theme_preset_id: string
        links: { title: string; url: string }[]
      }
    }>("/api/ai/onboarding-setup", {
      method: "POST",
      body: JSON.stringify({
        answers: {
          role: answers.role,
          audience: answers.audience,
          goal: answers.goal,
          platforms: answers.platforms?.split(",").map((s) => s.trim()),
          style: answers.style,
          country: answers.country,
        },
      }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Setup failed")
      return
    }

    const { setup } = res.data
    updateProfile({
      display_name: setup.display_names[0] ?? "",
      bio: setup.bio,
    })
    const preset = getThemePreset(setup.theme_preset_id)
    if (preset) setTheme(resolveThemeBackground(preset.theme))

    for (const link of setup.links.slice(0, 5)) {
      const icon = inferLinkIcon(link.title, link.url)
      if (mode === "draft") addLink(link.title, link.url, icon)
      else await persistLiveLink(link.title, link.url, icon)
    }

    toast.success("Your page is set up — edit anything you like!")
    localStorage.setItem("xhuma-ai-onboarding-done", "1")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-bio-dark/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-bio-dark" />
            <h2 className="text-lg font-semibold text-bio-dark">Set up with AI</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-bio-dark/5">
            <X className="size-5" />
          </button>
        </div>
        <BioMuted className="mt-1 text-sm">Optional — answer a few questions and we'll draft your page.</BioMuted>

        <p className="mt-4 text-xs font-medium text-bio-grey">
          Step {step + 1} of {STEPS.length}
        </p>
        <p className="mt-1 font-semibold text-bio-dark">{current.label}</p>

        {current.key === "goal" || current.key === "audience" ? (
          <BioTextarea
            className="mt-3 min-h-[80px]"
            placeholder={current.placeholder}
            value={answers[current.key] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [current.key]: e.target.value }))}
          />
        ) : (
          <BioInput
            className="mt-3"
            placeholder={current.placeholder}
            value={answers[current.key] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [current.key]: e.target.value }))}
          />
        )}

        <div className="mt-5 flex gap-2">
          {step > 0 && (
            <BioButton variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Back
            </BioButton>
          )}
          {!isLast ? (
            <BioGradientButton
              className="flex-1"
              onClick={() => setStep((s) => s + 1)}
              disabled={!answers[current.key]?.trim() && current.key === "role"}
            >
              Next
              <ChevronRight className="size-4" />
            </BioGradientButton>
          ) : (
            <BioGradientButton className="flex-1" onClick={finish} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate my page
            </BioGradientButton>
          )}
        </div>

        <button type="button" onClick={onClose} className="mt-3 w-full text-center text-xs text-bio-grey hover:text-bio-dark">
          Skip — I'll set up manually
        </button>
      </div>
    </div>
  )
}

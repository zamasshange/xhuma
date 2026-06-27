"use client"

import { useMemo } from "react"
import { CheckCircle2, Circle, Sparkles } from "lucide-react"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioMuted } from "@/components/ui/bio-form"
import { computeProfileHealth } from "@/lib/ai/profile-health"
import { cn } from "@/lib/utils"

type ProfileHealthCardProps = {
  onAction?: (action: string) => void
  compact?: boolean
}

export function ProfileHealthCard({ onAction, compact }: ProfileHealthCardProps) {
  const { state, updateProfile, addLink } = useEditor()

  const health = useMemo(() => (state ? computeProfileHealth(state) : null), [state])
  if (!health) return null

  const scoreColor =
    health.score >= 80 ? "text-emerald-600" : health.score >= 60 ? "text-amber-600" : "text-bio-red"

  const applyFix = (action?: string) => {
    if (!action) return
    onAction?.(action)
    switch (action) {
      case "add_bio":
        updateProfile({
          bio: state?.profile.bio || "Creator sharing my work and connecting with my audience in South Africa.",
        })
        break
      case "add_whatsapp":
        addLink("Chat on WhatsApp", "https://wa.me/27", "whatsapp")
        break
      default:
        break
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-bio-dark/6 bg-white px-4 py-3">
        <div className={cn("text-2xl font-bold tabular-nums", scoreColor)}>{health.score}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-bio-dark">Profile Health</p>
          <BioMuted className="text-xs">{health.suggestions[0]?.label ?? "Looking good!"}</BioMuted>
        </div>
        <Sparkles className="size-4 shrink-0 text-bio-grey" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-bio-dark/6 bg-gradient-to-br from-white to-bio-grey-f4/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-bio-grey">Profile Health Score</p>
          <p className={cn("mt-1 text-4xl font-bold tabular-nums tracking-tight", scoreColor)}>
            {health.score}
            <span className="text-lg font-semibold text-bio-grey">/100</span>
          </p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-xl bg-bio-dark/5">
          <Sparkles className="size-5 text-bio-dark" />
        </div>
      </div>

      {health.score === 100 && (
        <p className="mt-3 text-sm font-medium text-emerald-700">Your page is 100% complete — brilliant work!</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {health.checks.map((c) => (
          <span
            key={c.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
              c.passed ? "bg-emerald-50 text-emerald-800" : "bg-bio-grey-f4 text-bio-grey",
            )}
          >
            {c.passed ? <CheckCircle2 className="size-3" /> : <Circle className="size-3" />}
            {c.label}
          </span>
        ))}
      </div>

      {health.suggestions.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {health.suggestions.slice(0, 4).map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-bio-dark/6 bg-white p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bio-dark">{s.label}</p>
                <BioMuted className="mt-0.5 text-xs">{s.detail}</BioMuted>
              </div>
              {s.action && (
                <BioButton
                  variant="secondary"
                  className="h-8 shrink-0 px-3 text-[11px]"
                  onClick={() => applyFix(s.action)}
                >
                  Fix
                </BioButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

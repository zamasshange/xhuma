"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, Rocket, X, XCircle } from "lucide-react"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioGradientButton, BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import type { EditorState } from "@/lib/editor-state"

type ReviewCheck = {
  id: string
  label: string
  passed: boolean
  detail: string
  fix?: { type: string }
}

type Props = {
  open: boolean
  onClose: () => void
  onContinue: () => void
}

export function AiPublishReview({ open, onClose, onContinue }: Props) {
  const { state, updateProfile } = useEditor()
  const [loading, setLoading] = useState(true)
  const [checks, setChecks] = useState<ReviewCheck[]>([])
  const [summary, setSummary] = useState("")
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!open || !state) return
    setLoading(true)
    apiFetch<{ checks: ReviewCheck[]; summary: string; score: number }>("/api/ai/review", {
      method: "POST",
      body: JSON.stringify({ state }),
    }).then((res) => {
      setLoading(false)
      if (res.success && res.data) {
        setChecks(res.data.checks)
        setSummary(res.data.summary)
        setScore(res.data.score)
      }
    })
  }, [open, state])

  if (!open) return null

  const applyFix = (fix?: { type: string }) => {
    if (!fix || !state) return
    if (fix.type === "improve_bio") {
      updateProfile({
        bio: state.profile.bio || "Sharing my work and connecting with my community across South Africa.",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-bio-dark/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-bio-dark">AI Pre-publish Review</h2>
            <BioMuted className="mt-1 text-sm">Quick checks before you go live.</BioMuted>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-bio-dark/5">
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-bio-grey">
            <Loader2 className="size-5 animate-spin" /> Reviewing your page…
          </div>
        ) : (
          <>
            <p className="mt-4 text-3xl font-bold text-bio-dark">
              {score}
              <span className="text-lg font-medium text-bio-grey">/100 ready</span>
            </p>
            <p className="mt-2 text-sm text-bio-dark">{summary}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {checks.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-bio-dark/6 p-3"
                >
                  <div className="flex gap-2">
                    {c.passed ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-bio-dark">{c.label}</p>
                      <p className="text-xs text-bio-grey">{c.detail}</p>
                    </div>
                  </div>
                  {!c.passed && c.fix && (
                    <BioButton variant="secondary" className="h-8 shrink-0 px-2 text-[11px]" onClick={() => applyFix(c.fix)}>
                      Fix
                    </BioButton>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <BioGradientButton className="flex-1" onClick={onContinue}>
                <Rocket className="size-4" />
                Continue to publish
              </BioGradientButton>
              <BioButton variant="secondary" className="flex-1" onClick={onClose}>
                Keep editing
              </BioButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

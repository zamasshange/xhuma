"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { BioButton } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { REWRITE_TONE_LABELS, REWRITE_TONES, type RewriteTone } from "@/lib/ai/system-prompt"
import { cn } from "@/lib/utils"

type ImproveWithAiProps = {
  field: "bio" | "display_name" | "link_title" | "about"
  text: string
  context?: string
  onApply: (value: string) => void
  className?: string
  compact?: boolean
}

export function ImproveWithAi({ field, text, context, onApply, className, compact }: ImproveWithAiProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState<RewriteTone>("professional")

  const rewrite = async () => {
    setLoading(true)
    const res = await apiFetch<{ result: string }>("/api/ai/rewrite", {
      method: "POST",
      body: JSON.stringify({ field, text, tone, context }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Could not improve text")
      return
    }
    onApply(res.data.result)
    setOpen(false)
    toast.success("Applied AI suggestion — you can still edit it.")
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-bio-dark/10 bg-white font-semibold text-bio-dark transition-colors hover:border-bio-dark/25",
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
        )}
      >
        <Sparkles className={compact ? "size-3" : "size-3.5"} />
        Improve with AI
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-bio-dark/10 bg-white p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold text-bio-grey">Tone</p>
            <div className="flex flex-wrap gap-1.5">
              {REWRITE_TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-lg px-2 py-1 text-[11px] font-medium",
                    tone === t ? "bg-bio-dark text-white" : "bg-bio-grey-f4 text-bio-grey hover:text-bio-dark",
                  )}
                >
                  {REWRITE_TONE_LABELS[t]}
                </button>
              ))}
            </div>
            <BioButton className="mt-3 h-9 w-full text-xs" onClick={rewrite} disabled={loading}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              {loading ? "Improving…" : "Apply"}
            </BioButton>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Loader2, Palette } from "lucide-react"
import { AiIcon } from "@/components/icons/app-icons"
import { toast } from "sonner"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioInput, BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { getThemePreset, resolveThemeBackground } from "@/lib/theme-presets"
import type { ProfileTheme } from "@/lib/database.types"

const EXAMPLES = ["Luxury black and gold", "Modern and minimal", "Bright and playful", "Professional blue"]

export function AiThemeAssistant() {
  const { state, setTheme } = useEditor()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    const res = await apiFetch<{ theme: ProfileTheme; explanation: string }>("/api/ai/theme", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Could not generate theme")
      return
    }
    const t = res.data.theme
    const preset = t.preset_id ? getThemePreset(t.preset_id) : null
    setTheme(
      resolveThemeBackground({
        ...(preset?.theme ?? state?.profile.theme ?? t),
        ...t,
        link_style: state?.profile.theme.link_style,
      }),
    )
    setExplanation(res.data.explanation)
    toast.success("Theme applied — tweak anytime in the picker below.")
  }

  return (
    <div className="rounded-xl border border-bio-dark/6 bg-bio-grey-f4/50 p-4">
      <div className="flex items-center gap-2">
        <Palette className="size-4 text-bio-dark" />
        <p className="text-sm font-semibold text-bio-dark">AI Theme Assistant</p>
      </div>
      <BioMuted className="mt-1 text-xs">Describe how you want your page to feel.</BioMuted>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setPrompt(ex)}
            className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-bio-grey hover:text-bio-dark"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <BioInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Creative neon"'
          className="h-10 flex-1 text-sm"
        />
        <BioButton className="h-10 shrink-0 px-4" onClick={generate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <AiIcon className="size-4" />}
          Apply
        </BioButton>
      </div>

      {explanation && <p className="mt-2 text-xs text-bio-grey">{explanation}</p>}
    </div>
  )
}

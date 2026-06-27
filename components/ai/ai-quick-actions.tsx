"use client"

import { useState } from "react"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { getThemePreset, resolveThemeBackground } from "@/lib/theme-presets"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import type { EditorState } from "@/lib/editor-state"

const QUICK_ACTIONS = [
  { id: "improve_profile", label: "Improve my profile" },
  { id: "more_professional", label: "More professional" },
  { id: "simplify", label: "Simplify my page" },
  { id: "add_missing_links", label: "Add missing links" },
  { id: "better_bio", label: "Better bio" },
  { id: "refresh_colors", label: "Refresh colours" },
  { id: "organize_links", label: "Organise links" },
] as const

export function AiQuickActions() {
  const { state, updateProfile, setTheme, addLink, persistLiveLink, mode } = useEditor()
  const [loading, setLoading] = useState<string | null>(null)

  const applyResult = async (result: {
    profile?: Partial<EditorState["profile"]>
    links?: { title: string; url: string; icon?: string }[]
    theme?: EditorState["profile"]["theme"]
    message: string
  }) => {
    if (result.profile) updateProfile(result.profile)
    if (result.theme) {
      const preset = result.theme.preset_id ? getThemePreset(result.theme.preset_id) : null
      setTheme(resolveThemeBackground(preset?.theme ?? result.theme))
    }
    if (result.links?.length) {
      for (const link of result.links) {
        const icon = link.icon ?? inferLinkIcon(link.title, link.url)
        if (mode === "draft") addLink(link.title, link.url, icon)
        else await persistLiveLink(link.title, link.url, icon)
      }
    }
    toast.success(result.message)
  }

  const run = async (actionId: string) => {
    if (!state) return
    setLoading(actionId)
    const res = await apiFetch<{ result: { profile?: Partial<EditorState["profile"]>; links?: { title: string; url: string; icon?: string }[]; theme?: EditorState["profile"]["theme"]; message: string } }>(
      "/api/ai/quick-action",
      { method: "POST", body: JSON.stringify({ action: actionId, state }) },
    )
    setLoading(null)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Action failed")
      return
    }
    await applyResult(res.data.result)
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Zap className="size-4 text-bio-dark" />
        <p className="text-sm font-semibold text-bio-dark">Quick Actions</p>
      </div>
      <BioMuted className="mb-3 text-xs">One-click improvements — always editable afterwards.</BioMuted>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((a) => (
          <BioButton
            key={a.id}
            variant="secondary"
            className="h-9 px-3 text-xs"
            disabled={!!loading}
            onClick={() => run(a.id)}
          >
            {loading === a.id ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {a.label}
          </BioButton>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { AlertTriangle, Camera, Link2 } from "lucide-react"
import { useEditor } from "@/components/editor/editor-provider"
import { BioMuted } from "@/components/ui/bio-form"
import { computeProfileHealth } from "@/lib/ai/profile-health"

export function AiDelightHints() {
  const { state } = useEditor()

  const hints = useMemo(() => {
    if (!state) return []
    const items: { icon: typeof Camera; text: string; type: "info" | "warn" }[] = []
    const links = state.links.filter((l) => l.is_active !== false && l.title.trim())

    if (!state.profile.avatar_url) {
      items.push({ icon: Camera, text: "Add a profile photo — pages with photos feel more trustworthy.", type: "info" })
    }

    const urls = links.map((l) => l.url.trim().toLowerCase())
    const dupUrls = urls.filter((u, i) => u && urls.indexOf(u) !== i)
    if (dupUrls.length > 0) {
      items.push({ icon: Link2, text: "Duplicate link detected — visitors might tap the same destination twice.", type: "warn" })
    }

    const broken = links.filter((l) => l.url && l.url !== "#" && !/^https?:\/\//i.test(l.url))
    if (broken.length > 0) {
      items.push({ icon: AlertTriangle, text: `${broken.length} link(s) may need https:// at the start.`, type: "warn" })
    }

    const longLabels = links.filter((l) => l.title.length > 32)
    if (longLabels.length > 0) {
      items.push({ icon: AlertTriangle, text: "Some button labels are long — shorter labels work better on mobile.", type: "info" })
    }

    const health = computeProfileHealth(state)
    if (health.score === 100) {
      items.push({ icon: Camera, text: "Your page is 100% complete — brilliant work!", type: "info" })
    }

    return items.slice(0, 3)
  }, [state])

  if (hints.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {hints.map((h, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs ${
            h.type === "warn" ? "bg-amber-50 text-amber-900" : "bg-bio-grey-f4 text-bio-grey"
          }`}
        >
          <h.icon className="mt-0.5 size-3.5 shrink-0" />
          <BioMuted className="text-inherit">{h.text}</BioMuted>
        </div>
      ))}
    </div>
  )
}

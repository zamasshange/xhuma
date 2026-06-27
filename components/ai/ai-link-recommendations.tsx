"use client"

import { useMemo, useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { AiIcon } from "@/components/icons/app-icons"
import { toast } from "sonner"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioMuted } from "@/components/ui/bio-form"
import { SocialIconBadge, resolveLinkIcon } from "@/components/icons/social-icon"
import { getRecommendedLinks, PROFESSION_OPTIONS, type ProfessionId } from "@/lib/ai/link-recommendations"
import { inferLinkIcon } from "@/lib/infer-link-icon"

export function AiLinkRecommendations() {
  const { state, addLink, persistLiveLink, mode } = useEditor()
  const [profession, setProfession] = useState<ProfessionId>("creator")
  const [adding, setAdding] = useState(false)

  const recommendations = useMemo(() => {
    const fromBio = getRecommendedLinks(
      (state?.profile.bio ?? "") + " " + (state?.profile.display_name ?? ""),
    )
    const fromProfession = getRecommendedLinks(profession)
    const existing = new Set((state?.links ?? []).map((l) => l.title.toLowerCase()))
    return fromProfession.filter((r) => !existing.has(r.title.toLowerCase())).slice(0, 6)
  }, [state, profession])

  const addOne = async (title: string, url: string, icon: string) => {
    if (mode === "draft") {
      addLink(title, url, icon)
      toast.success(`${title} added`)
      return
    }
    const ok = await persistLiveLink(title, url, icon)
    if (ok) toast.success(`${title} added`)
    else toast.error("Could not save link")
  }

  const addAll = async () => {
    setAdding(true)
    for (const r of recommendations) {
      await addOne(r.title, r.url, r.icon)
    }
    setAdding(false)
    toast.success("Recommended links added!")
  }

  return (
    <div className="rounded-xl border border-bio-dark/6 bg-bio-grey-f4/50 p-4">
      <div className="flex items-center gap-2">
        <AiIcon className="size-4 text-bio-dark" />
        <p className="text-sm font-semibold text-bio-dark">AI Link Recommendations</p>
      </div>
      <BioMuted className="mt-1 text-xs">Tailored for South African creators — add individually or all at once.</BioMuted>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PROFESSION_OPTIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setProfession(p.id)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
              profession === p.id ? "bg-bio-dark text-white" : "bg-white text-bio-grey"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {recommendations.length === 0 ? (
        <BioMuted className="mt-3 text-xs">You already have the recommended links for this type.</BioMuted>
      ) : (
        <>
          <ul className="mt-3 flex flex-col gap-2">
            {recommendations.map((r) => (
              <li
                key={r.title}
                className="flex items-center justify-between gap-2 rounded-xl border border-bio-dark/6 bg-white p-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <SocialIconBadge icon={resolveLinkIcon(r.icon, r.title, r.url)} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bio-dark">{r.title}</p>
                    {r.reason && <p className="truncate text-[10px] text-bio-grey">{r.reason}</p>}
                  </div>
                </div>
                <BioButton
                  variant="secondary"
                  className="h-8 shrink-0 px-2 text-[11px]"
                  onClick={() => addOne(r.title, r.url, r.icon ?? inferLinkIcon(r.title, r.url) ?? "link")}
                >
                  <Plus className="size-3" />
                  Add
                </BioButton>
              </li>
            ))}
          </ul>
          <BioButton className="mt-3 h-9 w-full text-xs" onClick={addAll} disabled={adding}>
            {adding ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Add all recommended
          </BioButton>
        </>
      )}
    </div>
  )
}

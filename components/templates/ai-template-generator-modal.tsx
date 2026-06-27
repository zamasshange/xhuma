"use client"

import { useState } from "react"
import { Loader2, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BioButton, BioGradientButton, BioTextarea } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import type { TemplateDocument } from "@/lib/editor-state"
import { BLANK_TEMPLATE_ID } from "@/lib/editor-sections"
import { saveAiGeneratedTemplate } from "@/lib/user-templates"
import { stashPendingDraft } from "@/lib/client-draft"

const EXAMPLES = [
  "I am a South African DJ",
  "I run a coffee shop in Cape Town",
  "I am a software developer",
  "I sell handmade jewellery",
  "I am a wedding photographer",
]

export function AiTemplateGeneratorModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    const res = await apiFetch<{
      templateId: string
      name: string
      document: TemplateDocument
      message: string
    }>("/api/ai/template-generator", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Could not generate template")
      return
    }
    saveAiGeneratedTemplate(res.data.name, res.data.document)
    stashPendingDraft(BLANK_TEMPLATE_ID, undefined, { document: res.data.document })
    toast.success(res.data.message)
    onClose()
    router.push("/editor")
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-bio-dark/50 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <h2 className="text-lg font-semibold">Generate template with AI</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-bio-grey-f4">
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-bio-grey">
          Describe your page — AI picks layout, colours, sections, and links for South African creators.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="rounded-lg bg-bio-grey-f4 px-2.5 py-1 text-[11px] font-medium text-bio-grey hover:text-bio-dark"
            >
              {ex}
            </button>
          ))}
        </div>
        <BioTextarea
          className="mt-4 min-h-[100px]"
          placeholder="Describe who you are and what your page needs…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <BioButton variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </BioButton>
          <BioGradientButton className="flex-1" onClick={generate} disabled={loading || !prompt.trim()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </BioGradientButton>
        </div>
      </div>
    </div>
  )
}

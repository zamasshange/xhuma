"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, GripVertical, Loader2, Plus, Sparkles, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useEditor } from "@/components/editor/editor-provider"
import { EditorPanel, EditorSectionTitle } from "@/components/editor/editor-shell"
import { BioButton, BioInput, BioTextarea } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { SECTION_CATALOG, createSection, type PageSection } from "@/lib/editor-sections"

export function PageSectionsPanel() {
  const { state, addPageSection, updatePageSection, removePageSection, movePageSection, saveAsTemplate } = useEditor()
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)

  if (!state) return null

  const addWithAi = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    const res = await apiFetch<{ section: PageSection; message: string }>("/api/ai/section", {
      method: "POST",
      body: JSON.stringify({ prompt: aiPrompt, theme: state.profile.theme }),
    })
    setAiLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Could not add section")
      return
    }
    addPageSection(res.data.section)
    setAiPrompt("")
    toast.success(res.data.message)
  }

  const editable = state.page_sections.filter((s) => !["profile", "links"].includes(s.type))

  return (
    <EditorPanel>
      <EditorSectionTitle subtitle="Add, reorder, and customise page sections.">
        Page sections
      </EditorSectionTitle>

      <div className="rounded-xl border border-dashed border-bio-dark/15 bg-bio-grey-f4/50 p-3">
        <p className="text-xs font-semibold text-bio-dark">AI Section Builder</p>
        <BioInput
          className="mt-2 h-10 text-sm"
          placeholder='e.g. "Add testimonials"'
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
        />
        <BioButton className="mt-2 h-9 w-full text-xs" onClick={addWithAi} disabled={aiLoading}>
          {aiLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          Add with AI
        </BioButton>
      </div>

      <BioButton variant="secondary" className="mt-3 h-9 w-full text-xs" onClick={() => setShowCatalog((s) => !s)}>
        <Plus className="size-3.5" />
        {showCatalog ? "Hide section library" : "Add section manually"}
      </BioButton>

      {showCatalog && (
        <div className="mt-2 grid max-h-48 gap-1 overflow-y-auto">
          {SECTION_CATALOG.filter((s) => !["profile", "links"].includes(s.type)).map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => {
                addPageSection(createSection(s.type))
                toast.success(`${s.label} added`)
              }}
              className="rounded-lg border border-bio-dark/8 bg-white px-3 py-2 text-left text-xs hover:border-bio-dark/20"
            >
              <span className="font-semibold">{s.label}</span>
              <span className="ml-2 text-bio-grey">{s.description}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {editable.map((section, index) => (
          <SectionRow
            key={section.id}
            section={section}
            index={index}
            total={editable.length}
            onUpdate={(patch) => updatePageSection(section.id, patch)}
            onRemove={() => removePageSection(section.id)}
            onMove={(dir) => movePageSection(section.id, dir)}
          />
        ))}
      </ul>

      <BioButton
        variant="secondary"
        className="mt-4 h-9 w-full text-xs"
        onClick={() => {
          const name = state.profile.display_name || "My template"
          saveAsTemplate(`${name} template`)
          toast.success("Saved to My Templates")
        }}
      >
        Save as template
      </BioButton>
    </EditorPanel>
  )
}

function SectionRow({
  section,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  section: PageSection
  index: number
  total: number
  onUpdate: (patch: Partial<PageSection>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const collapsed = section.collapsed ?? false
  const body = String(section.content.body ?? "")

  return (
    <li className="rounded-xl border border-bio-dark/8 bg-bio-grey-f4 p-3">
      <div className="flex items-center gap-2">
        <GripVertical className="size-4 shrink-0 text-bio-grey" />
        <button type="button" className="min-w-0 flex-1 text-left text-sm font-semibold" onClick={() => onUpdate({ collapsed: !collapsed })}>
          {section.title ?? section.type}
        </button>
        <button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="p-1 disabled:opacity-30">
          <ChevronUp className="size-4" />
        </button>
        <button type="button" disabled={index >= total - 1} onClick={() => onMove(1)} className="p-1 disabled:opacity-30">
          <ChevronDown className="size-4" />
        </button>
        <button type="button" onClick={onRemove} className="p-1 text-bio-red">
          <Trash2 className="size-4" />
        </button>
      </div>
      {!collapsed && section.type === "about" && (
        <BioTextarea
          className="mt-2 min-h-[72px] text-xs"
          value={body}
          onChange={(e) => onUpdate({ content: { ...section.content, body: e.target.value } })}
        />
      )}
    </li>
  )
}

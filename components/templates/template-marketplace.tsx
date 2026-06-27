"use client"

import { useMemo, useState } from "react"
import { Eye, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { BioButton } from "@/components/ui/bio-form"
import { AiIcon, PlusIcon } from "@/components/icons/app-icons"
import { TemplateCardPreview } from "@/components/templates/template-card-preview"
import {
  MARKETPLACE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type MarketplaceTemplate,
  duplicateTemplateDocument,
  getBlankTemplateDocument,
} from "@/lib/templates/catalog"
import { BLANK_TEMPLATE_ID } from "@/lib/editor-sections"
import {
  getFavoriteTemplateIds,
  getRecentTemplateIds,
  getSavedTemplates,
  getAiGeneratedTemplates,
  toggleFavoriteTemplate,
  pushRecentTemplate,
} from "@/lib/user-templates"
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal"
import { AiTemplateGeneratorModal } from "@/components/templates/ai-template-generator-modal"
import { stashPendingDraft } from "@/lib/client-draft"
import { useRouter } from "next/navigation"

type TabId = "all" | "featured" | "trending" | "new" | "popular" | "my" | "recent" | "ai" | "ai-saved"

export function TemplateMarketplace({
  compact = false,
  showHeader = true,
}: {
  compact?: boolean
  showHeader?: boolean
}) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>("featured")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteTemplateIds())
  const [preview, setPreview] = useState<MarketplaceTemplate | null>(null)
  const [showAi, setShowAi] = useState(false)

  const saved = useMemo(() => getSavedTemplates(), [tab])
  const recentIds = useMemo(() => getRecentTemplateIds(), [tab])

  const aiGenerated = useMemo(() => getAiGeneratedTemplates(), [tab])

  const templates = useMemo(() => {
    let list = [...MARKETPLACE_TEMPLATES]
    if (tab === "my") return saved
    if (tab === "ai-saved") return aiGenerated
    if (tab === "recent") {
      return recentIds
        .map((id) => MARKETPLACE_TEMPLATES.find((t) => t.id === id))
        .filter(Boolean) as MarketplaceTemplate[]
    }
    if (tab === "featured") list = list.filter((t) => t.tags.includes("featured"))
    else if (tab === "trending") list = list.filter((t) => t.tags.includes("trending"))
    else if (tab === "new") list = [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    else if (tab === "popular") list = list.filter((t) => t.tags.includes("popular"))
    else if (tab === "ai") list = list.filter((t) => t.aiReady)

    if (category !== "All") list = list.filter((t) => t.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [tab, query, category, saved, recentIds, aiGenerated])

  const useTemplate = (t: MarketplaceTemplate, duplicate = false) => {
    pushRecentTemplate(t.id)
    const doc = duplicate ? duplicateTemplateDocument(t.default_data) : t.default_data
    const templateId = t.id.startsWith("saved-") ? BLANK_TEMPLATE_ID : t.id
    stashPendingDraft(templateId, undefined, { document: doc, duplicate })
    router.push("/editor")
  }

  const startBlank = () => {
    pushRecentTemplate(BLANK_TEMPLATE_ID)
    stashPendingDraft(BLANK_TEMPLATE_ID, undefined, { document: getBlankTemplateDocument() })
    router.push("/editor")
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "featured", label: "Featured" },
    { id: "trending", label: "Trending" },
    { id: "new", label: "Recently Added" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recently Used" },
    { id: "my", label: "My Templates" },
    { id: "ai-saved", label: "AI Generated" },
    { id: "ai", label: "AI Ready" },
    { id: "all", label: "All" },
  ]

  return (
    <section id="templates" className={cn("text-bio-dark", compact ? "pt-8" : "pt-28 max-lg:pt-16")}>
      {showHeader && (
        <div className="mx-auto mb-8 w-[min(900px,92%)] text-center">
          <h2 className="text-5xl font-semibold tracking-tighter max-lg:text-4xl max-sm:text-3xl">
            Template marketplace
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-bio-grey">
            Professionally designed layouts — or start from a blank canvas with AI-powered sections.
          </p>
        </div>
      )}

      <div className="mx-auto w-[min(1200px,94%)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            placeholder="Search templates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-bio-dark/10 bg-white px-4 text-sm outline-none focus:border-bio-dark/25"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-xl border border-bio-dark/10 bg-white px-3 text-sm"
          >
            <option value="All">All categories</option>
            {TEMPLATE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <BioButton
            type="button"
            className="h-11 w-full shrink-0 px-5 sm:w-auto"
            onClick={() => setShowAi(true)}
          >
            <AiIcon className="size-4" />
            Generate with AI
          </BioButton>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold min-h-[40px]",
                tab === t.id ? "bg-bio-dark text-white" : "bg-bio-grey-f4 text-bio-grey",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateFromScratchCard onSelect={startBlank} />

          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              favorited={favorites.includes(t.id)}
              onFavorite={() => setFavorites(toggleFavoriteTemplate(t.id))}
              onPreview={() => setPreview(t)}
              onUse={() => useTemplate(t)}
              onDuplicate={() => useTemplate(t, true)}
            />
          ))}
        </div>
      </div>

      {preview && (
        <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} onUse={() => useTemplate(preview)} />
      )}
      {showAi && <AiTemplateGeneratorModal onClose={() => setShowAi(false)} />}
    </section>
  )
}

function CreateFromScratchCard({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-dashed border-bio-dark/20 bg-gradient-to-br from-bio-grey-f4 to-white p-5 shadow-sm">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <PlusIcon className="size-10 text-bio-dark" />
        <h3 className="mt-3 text-lg font-semibold">Create from scratch</h3>
        <p className="mt-1 text-xs text-bio-grey">Blank profile + links — add sections with AI</p>
      </div>
      <BioButton className="w-full" onClick={onSelect}>
        <PlusIcon className="size-4" />
        Start blank
      </BioButton>
    </div>
  )
}

function TemplateCard({
  template,
  favorited,
  onFavorite,
  onPreview,
  onUse,
  onDuplicate,
}: {
  template: MarketplaceTemplate
  favorited: boolean
  onFavorite: () => void
  onPreview: () => void
  onUse: () => void
  onDuplicate: () => void
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-bio-dark/8 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative bg-bio-grey-f4">
        <div className="relative z-0">
          <TemplateCardPreview template={template} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-2 p-2.5">
          {template.aiReady && (
            <span className="rounded-full bg-bio-dark px-2.5 py-1 text-[10px] font-semibold text-white shadow-md ring-1 ring-black/10">
              AI Ready
            </span>
          )}
          <button
            type="button"
            onClick={onFavorite}
            className="pointer-events-auto ml-auto rounded-full bg-white p-2 shadow-md ring-1 ring-black/5 transition hover:bg-white"
            aria-label="Favourite"
          >
            <Heart className={cn("size-4", favorited ? "fill-red-500 text-red-500" : "text-bio-grey")} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-bio-grey">{template.category}</p>
        <h3 className="font-semibold text-bio-dark">{template.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-bio-grey">{template.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <BioButton variant="secondary" className="h-8 flex-1 px-2 text-[11px]" onClick={onPreview}>
            <Eye className="size-3.5" />
            Preview
          </BioButton>
          <BioButton className="h-8 flex-1 px-2 text-[11px]" onClick={onUse}>
            Use
          </BioButton>
        </div>
        <button type="button" onClick={onDuplicate} className="mt-2 text-center text-[10px] text-bio-grey hover:text-bio-dark">
          Duplicate to edit
        </button>
      </div>
    </article>
  )
}

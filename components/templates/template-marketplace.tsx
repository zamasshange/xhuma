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
    <section id="templates" className={cn("text-bio-dark", compact ? "pt-8" : "pt-24 max-lg:pt-16")}>
      {showHeader && (
        <div className="mx-auto mb-6 w-[min(900px,92%)] px-1 text-center sm:mb-8">
          <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
            Template marketplace
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-bio-grey sm:text-lg">
            Professionally designed layouts — or start from a blank canvas with AI-powered sections.
          </p>
        </div>
      )}

      <div className="mx-auto w-[min(1200px,100%)] px-3 sm:px-4">
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
            className="h-11 w-full rounded-xl border border-bio-dark/10 bg-white px-3 text-sm sm:w-auto"
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

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2.5 text-xs font-semibold min-h-11 sm:px-4",
                tab === t.id ? "bg-bio-dark text-white" : "bg-bio-grey-f4 text-bio-grey",
              )}
            >
              <span className="sm:hidden">
                {t.id === "ai-saved" ? "AI Gen" : t.id === "recent" ? "Recent" : t.label.split(" ")[0]}
              </span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="flex flex-col overflow-hidden rounded-xl border-2 border-dashed border-bio-dark/20 bg-gradient-to-br from-bio-grey-f4 to-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center sm:py-8">
        <PlusIcon className="size-8 text-bio-dark sm:size-10" />
        <h3 className="mt-2 text-sm font-semibold sm:mt-3 sm:text-lg">Create from scratch</h3>
        <p className="mt-1 hidden text-xs text-bio-grey sm:block">Blank profile + links — add sections with AI</p>
      </div>
      <BioButton className="min-h-10 w-full text-xs sm:min-h-11 sm:text-sm" onClick={onSelect}>
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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-bio-dark/8 bg-white shadow-sm transition hover:shadow-md sm:rounded-2xl">
      <div className="relative bg-bio-grey-f4">
        <div className="relative z-0">
          <TemplateCardPreview template={template} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-1 p-1.5 sm:gap-2 sm:p-2.5">
          {template.aiReady && (
            <span className="rounded-md bg-bio-dark px-1.5 py-0.5 text-[8px] font-semibold text-white shadow-md ring-1 ring-black/10 sm:rounded-full sm:px-2.5 sm:py-1 sm:text-[10px]">
              AI Ready
            </span>
          )}
          <button
            type="button"
            onClick={onFavorite}
            className="pointer-events-auto ml-auto flex min-h-8 min-w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition hover:bg-white sm:min-h-11 sm:min-w-11"
            aria-label="Favourite"
          >
            <Heart className={cn("size-3.5 sm:size-4", favorited ? "fill-red-500 text-red-500" : "text-bio-grey")} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-2 sm:p-3">
        <p className="truncate text-[9px] font-medium uppercase tracking-wide text-bio-grey sm:text-[10px]">
          {template.category}
        </p>
        <h3 className="truncate text-sm font-semibold text-bio-dark sm:text-base">{template.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-bio-grey sm:mt-1 sm:line-clamp-2 sm:text-xs">
          {template.description}
        </p>
        <div className="mt-2 flex flex-col gap-1.5 sm:mt-3 sm:gap-2">
          <BioButton variant="secondary" className="min-h-9 px-2 text-[11px] sm:min-h-11 sm:px-3 sm:text-sm" onClick={onPreview}>
            <Eye className="size-3.5 sm:size-4" />
            Preview
          </BioButton>
          <BioButton className="min-h-9 px-2 text-[11px] sm:min-h-11 sm:px-3 sm:text-sm" onClick={onUse}>
            Use template
          </BioButton>
        </div>
        <button
          type="button"
          onClick={onDuplicate}
          className="mt-1.5 hidden min-h-8 text-center text-xs text-bio-grey hover:text-bio-dark sm:mt-2 sm:block"
        >
          Duplicate to edit
        </button>
      </div>
    </article>
  )
}

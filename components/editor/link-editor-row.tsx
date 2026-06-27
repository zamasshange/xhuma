"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react"
import { SocialIconBadge, resolveLinkIcon } from "@/components/icons/social-icon"
import { ImproveWithAi } from "@/components/ai/improve-with-ai"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import type { EditorLink } from "@/lib/editor-state"
import { cn } from "@/lib/utils"

function hostLabel(url: string) {
  if (!url.trim()) return "Add a URL"
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname
    return host.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function LinkEditorRow({
  link,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
  onBlur,
}: {
  link: EditorLink
  index: number
  total: number
  onUpdate: (patch: Partial<EditorLink>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  onBlur?: () => void
}) {
  const [open, setOpen] = useState(false)
  const displayIcon = resolveLinkIcon(link.icon, link.title, link.url)

  const patchWithIcon = (patch: Partial<EditorLink>) => {
    const title = patch.title ?? link.title
    const url = patch.url ?? link.url
    const inferred = inferLinkIcon(title, url)
    onUpdate({ ...patch, icon: inferred ?? link.icon })
  }

  const inputClass =
    "h-9 w-full rounded-md border border-bio-dark/8 bg-white px-2.5 text-sm text-bio-dark outline-none placeholder:text-bio-grey focus:border-bio-dark/20 sm:h-10 sm:rounded-lg sm:px-3"

  return (
    <div
      className={cn(
        "overflow-hidden border border-bio-dark/8 bg-white",
        "rounded-lg sm:rounded-xl",
        !link.is_active && "opacity-55",
      )}
    >
      {/* Mobile: compact summary — tap to expand */}
      <div className="flex items-center gap-2 p-2 sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <SocialIconBadge icon={displayIcon} size={34} className="shrink-0 rounded-md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-bio-dark">
              {link.title.trim() || "Untitled link"}
            </p>
            <p className="truncate text-[11px] text-bio-grey">{hostLabel(link.url)}</p>
          </div>
          <ChevronDown
            className={cn("size-4 shrink-0 text-bio-grey transition-transform", open && "rotate-180")}
          />
        </button>
        <button
          type="button"
          onClick={() => onUpdate({ is_active: !link.is_active })}
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-bio-grey hover:bg-bio-grey-f4"
          aria-label={link.is_active ? "Hide link" : "Show link"}
        >
          {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>

      {/* Mobile: expanded editor */}
      {open && (
        <div className="space-y-2 border-t border-bio-dark/6 px-2.5 pb-2.5 pt-2 sm:hidden">
          <input
            className={inputClass}
            value={link.title}
            placeholder="Button text"
            onChange={(e) => patchWithIcon({ title: e.target.value })}
            onBlur={onBlur}
          />
          <input
            className={inputClass}
            value={link.url}
            placeholder="https://..."
            onChange={(e) => patchWithIcon({ url: e.target.value })}
            onBlur={onBlur}
          />
          <div className="flex items-center justify-between gap-2">
            <ImproveWithAi
              field="link_title"
              text={link.title}
              context={link.url}
              compact
              onApply={(title) => patchWithIcon({ title })}
            />
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMove(-1)}
                className="flex size-8 items-center justify-center rounded-md text-bio-grey hover:bg-bio-grey-f4 disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                disabled={index >= total - 1}
                onClick={() => onMove(1)}
                className="flex size-8 items-center justify-center rounded-md text-bio-grey hover:bg-bio-grey-f4 disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex size-8 items-center justify-center rounded-md text-bio-red hover:bg-red-50"
                aria-label="Delete link"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: full editor always visible */}
      <div className="hidden gap-2.5 p-3 sm:flex">
        <div className="flex flex-col justify-center gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="flex size-8 items-center justify-center rounded-md text-bio-grey hover:bg-bio-grey-f4 disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </button>
          <GripVertical className="mx-auto size-3.5 text-bio-grey/40" aria-hidden />
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => onMove(1)}
            className="flex size-8 items-center justify-center rounded-md text-bio-grey hover:bg-bio-grey-f4 disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <SocialIconBadge icon={displayIcon} size={40} className="mt-1 shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              className={cn(inputClass, "font-medium")}
              value={link.title}
              placeholder="Button text"
              onChange={(e) => patchWithIcon({ title: e.target.value })}
              onBlur={onBlur}
            />
            <ImproveWithAi
              field="link_title"
              text={link.title}
              context={link.url}
              compact
              onApply={(title) => patchWithIcon({ title })}
            />
          </div>
          <input
            className={inputClass}
            value={link.url}
            placeholder="https://..."
            onChange={(e) => patchWithIcon({ url: e.target.value })}
            onBlur={onBlur}
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => onUpdate({ is_active: !link.is_active })}
              className="flex size-9 items-center justify-center rounded-md border border-bio-dark/8 text-bio-grey hover:bg-bio-grey-f4"
              aria-label={link.is_active ? "Hide link" : "Show link"}
            >
              {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex size-9 items-center justify-center rounded-md border border-bio-dark/8 text-bio-red hover:bg-red-50"
              aria-label="Delete link"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react"
import { SocialIconBadge, resolveLinkIcon } from "@/components/icons/social-icon"
import { BioButton } from "@/components/ui/bio-form"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import type { EditorLink } from "@/lib/editor-state"
import { cn } from "@/lib/utils"

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
  const displayIcon = resolveLinkIcon(link.icon, link.title, link.url)

  const patchWithIcon = (patch: Partial<EditorLink>) => {
    const title = patch.title ?? link.title
    const url = patch.url ?? link.url
    const inferred = inferLinkIcon(title, url)
    onUpdate({ ...patch, icon: inferred ?? link.icon })
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-bio-grey-f4 p-4",
        !link.is_active && "opacity-50",
      )}
    >
      <div className="flex gap-3">
        <div className="flex flex-col gap-0.5 pt-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded-lg p-1 hover:bg-white disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => onMove(1)}
            className="rounded-lg p-1 hover:bg-white disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <SocialIconBadge icon={displayIcon} size={48} className="mt-0.5" />

        <div className="min-w-0 flex-1 space-y-2">
          <input
            className="h-11 w-full rounded-xl bg-white px-4 text-sm font-medium text-bio-dark outline-none placeholder:font-normal placeholder:text-bio-grey"
            value={link.title}
            placeholder="Button text"
            onChange={(e) => patchWithIcon({ title: e.target.value })}
            onBlur={onBlur}
          />
          <input
            className="h-11 w-full rounded-xl bg-white px-4 text-sm text-bio-dark outline-none placeholder:text-bio-grey"
            value={link.url}
            placeholder="https://..."
            onChange={(e) => patchWithIcon({ url: e.target.value })}
            onBlur={onBlur}
          />
          <div className="flex gap-2">
            <BioButton
              variant="secondary"
              className="h-9 px-3"
              onClick={() => onUpdate({ is_active: !link.is_active })}
            >
              {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </BioButton>
            <BioButton variant="secondary" className="h-9 px-3 text-bio-red" onClick={onRemove}>
              <Trash2 className="size-4" />
            </BioButton>
          </div>
        </div>
      </div>
    </div>
  )
}

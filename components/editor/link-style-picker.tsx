"use client"

import type { LinkCardStyle } from "@/lib/link-card-styles"
import { LINK_CARD_STYLES } from "@/lib/link-card-styles"
import { cn } from "@/lib/utils"

function StylePreview({ style, active }: { style: LinkCardStyle; active: boolean }) {
  const previewClass: Record<LinkCardStyle, string> = {
    rounded: "rounded-lg",
    square: "rounded-sm",
    pill: "rounded-full",
    glass: "profile-link-glass-preview",
    comic: "profile-link-comic-preview",
    outline: "profile-link-outline-preview",
    soft: "rounded-xl profile-link-soft-preview",
    wavy: "profile-link-wavy-preview",
    neon: "rounded-lg profile-link-neon-preview",
  }

  return (
    <span
      className={cn(
        "flex h-9 w-full items-center justify-center text-[10px] font-semibold",
        previewClass[style],
        active ? "ring-2 ring-bio-dark ring-offset-1" : "",
      )}
    >
      Aa
    </span>
  )
}

export function LinkStylePicker({
  value,
  onChange,
}: {
  value: LinkCardStyle
  onChange: (style: LinkCardStyle) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
      {LINK_CARD_STYLES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={cn(
            "rounded-xl border p-2 text-left transition-all",
            value === s.id
              ? "border-bio-dark bg-white shadow-sm"
              : "border-bio-dark/8 bg-bio-grey-f4 hover:border-bio-dark/20 hover:bg-white",
          )}
        >
          <StylePreview style={s.id} active={value === s.id} />
          <p className="mt-2 truncate text-xs font-semibold text-bio-dark">{s.name}</p>
          <p className="truncate text-[10px] text-bio-grey">{s.hint}</p>
        </button>
      ))}
    </div>
  )
}

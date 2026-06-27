"use client"

import { THEME_PRESETS } from "@/lib/theme-presets"
import { ThemePreviewImage } from "@/components/themes/theme-preview-image"
import type { ProfileTheme } from "@/lib/database.types"
import { cn } from "@/lib/utils"

export function ThemePicker({
  selectedId,
  onSelect,
}: {
  selectedId?: string
  onSelect: (id: string, theme: ProfileTheme) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {THEME_PRESETS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id, t.theme)}
          className={cn(
            "text-left transition-transform hover:scale-[1.02]",
            selectedId === t.id && "rounded-2xl ring-2 ring-bio-dark ring-offset-2",
          )}
        >
          <div className="overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(13,12,34,0.06)] ring-1 ring-black/5">
            <ThemePreviewImage src={t.image} alt={t.name} />
          </div>
          <p className="mt-1.5 truncate text-center text-[11px] font-medium text-bio-dark sm:text-xs">
            {t.name}
          </p>
        </button>
      ))}
    </div>
  )
}

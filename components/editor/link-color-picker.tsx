"use client"

import type { ProfileTheme } from "@/lib/database.types"
import { BioLabel } from "@/components/ui/bio-form"
import { cn } from "@/lib/utils"

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <BioLabel className="text-xs">{label}</BioLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-bio-dark/10 bg-white p-0.5"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 min-w-0 flex-1 rounded-xl border border-bio-dark/10 bg-white px-3 font-mono text-xs uppercase text-bio-dark outline-none focus:border-bio-dark/25"
          maxLength={7}
        />
      </div>
    </div>
  )
}

export function LinkColorPicker({
  theme,
  onChange,
}: {
  theme: ProfileTheme
  onChange: (patch: Partial<ProfileTheme>) => void
}) {
  const buttonBg = theme.button || "#0d0c22"
  const buttonText = theme.button_text || "#ffffff"
  const iconStyle = theme.social_icon_style ?? "brand"

  return (
    <div className="mt-4 space-y-4 border-t border-bio-dark/6 pt-4">
      <p className="text-sm font-semibold text-bio-dark">Link & icon colours</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorField label="Button colour" value={buttonBg} onChange={(button) => onChange({ button })} />
        <ColorField label="Button text" value={buttonText} onChange={(button_text) => onChange({ button_text })} />
      </div>

      <div>
        <BioLabel className="text-xs">Social icons (top row)</BioLabel>
        <div className="mt-2 flex gap-2">
          {(
            [
              { id: "brand" as const, label: "Brand colours" },
              { id: "theme" as const, label: "Match buttons" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ social_icon_style: opt.id })}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                iconStyle === opt.id
                  ? "border-bio-dark bg-bio-dark text-white"
                  : "border-bio-dark/10 bg-white text-bio-grey hover:border-bio-dark/25",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

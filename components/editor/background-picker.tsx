"use client"

import type { ProfileTheme } from "@/lib/database.types"
import { BioLabel } from "@/components/ui/bio-form"
import { THEME_PRESETS, resolveThemeBackground } from "@/lib/theme-presets"
import { cn } from "@/lib/utils"

const SOLID_SWATCHES = [
  "#ffffff",
  "#f4f4f5",
  "#0f0f0f",
  "#0d0c22",
  "#1e3a5f",
  "#14532d",
  "#4c1d95",
  "#831843",
  "#fce7f3",
  "#f5f0e8",
  "#38bdf8",
  "#facc15",
  "#ec4899",
  "#d1fae5",
]

export function BackgroundPicker({
  theme,
  onChange,
}: {
  theme: ProfileTheme
  onChange: (next: ProfileTheme) => void
}) {
  const usingImage = Boolean(theme.preset_id && theme.bg_image)
  const bg = theme.bg || "#ffffff"

  const pickSolid = (color: string) => {
    onChange({
      ...theme,
      bg: color,
      preset_id: undefined,
      bg_image: undefined,
    })
  }

  const pickPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const resolved = resolveThemeBackground(preset.theme)
    onChange({
      ...theme,
      ...resolved,
      link_style: theme.link_style ?? resolved.link_style,
      social_icon_style: theme.social_icon_style,
    })
  }

  return (
    <div className="mt-5 space-y-5 border-t border-bio-dark/6 pt-5">
      <div>
        <BioLabel>Solid background colour</BioLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {SOLID_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => pickSolid(color)}
              className={cn(
                "size-9 rounded-lg border-2 transition-transform hover:scale-105",
                !usingImage && bg.toLowerCase() === color.toLowerCase()
                  ? "border-bio-dark ring-2 ring-bio-dark/20"
                  : "border-black/10",
              )}
              style={{ backgroundColor: color }}
              aria-label={`Background ${color}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={bg}
            onChange={(e) => pickSolid(e.target.value)}
            className="size-10 cursor-pointer rounded-lg border border-bio-dark/10 bg-white p-0.5"
            aria-label="Custom background colour"
          />
          <input
            type="text"
            value={bg}
            onChange={(e) => pickSolid(e.target.value)}
            className="h-10 min-w-0 flex-1 rounded-xl border border-bio-dark/10 bg-white px-3 font-mono text-xs uppercase text-bio-dark outline-none focus:border-bio-dark/25"
            maxLength={7}
          />
        </div>
      </div>

      <div>
        <BioLabel>Image themes</BioLabel>
        <p className="mt-1 text-xs text-bio-grey">Full-bleed artwork — same as the gallery above.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {THEME_PRESETS.filter((p) => p.theme.preset_id).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pickPreset(p.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                theme.preset_id === p.id
                  ? "border-bio-dark bg-bio-dark text-white"
                  : "border-bio-dark/10 bg-white text-bio-grey hover:border-bio-dark/25",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

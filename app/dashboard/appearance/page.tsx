"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api-fetch"
import type { DbProfile, ProfileTheme } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"

const PRESETS: { name: string; theme: ProfileTheme }[] = [
  { name: "Midnight", theme: { bg: "#0d0c22", text: "#ffffff", button: "#7c3aed", style: "rounded" } },
  { name: "Ocean", theme: { bg: "#0f172a", text: "#e2e8f0", button: "#3b82f6", style: "pill" } },
  { name: "Forest", theme: { bg: "#052e16", text: "#ecfdf5", button: "#22c55e", style: "rounded" } },
  { name: "Sunset", theme: { bg: "#1c1917", text: "#fef3c7", button: "#f97316", style: "square" } },
  { name: "Rose", theme: { bg: "#1a0a12", text: "#fce7f3", button: "#ec4899", style: "pill" } },
  { name: "Clean", theme: { bg: "#fafafa", text: "#171717", button: "#171717", style: "rounded" } },
]

const BUTTON_COLORS = ["#7c3aed", "#3b82f6", "#22c55e", "#f97316", "#ec4899", "#171717"]
const STYLES: ProfileTheme["style"][] = ["rounded", "pill", "square"]

export default function AppearancePage() {
  const { profile, links, loading, setProfile } = useDashboard()
  const [saving, setSaving] = useState(false)

  if (loading || !profile) return <p className="text-muted-foreground">Loading…</p>

  const theme = { ...DEFAULT_THEME, ...profile.theme }

  const setTheme = (patch: Partial<ProfileTheme>) => {
    setProfile({ ...profile, theme: { ...theme, ...patch } })
  }

  const save = async () => {
    setSaving(true)
    const res = await apiFetch<DbProfile>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ theme }),
    })
    setSaving(false)
    if (!res.success) {
      toast.error(res.error ?? "Save failed")
      return
    }
    if (res.data) setProfile(res.data)
    toast.success("Appearance saved!")
  }

  const activeLinks = links.filter((l) => l.is_active).map((l) => ({ id: l.id, title: l.title, url: l.url }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Appearance</h1>
        <p className="mt-1 text-muted-foreground">Customize colors and button style. Updates preview live.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <Label className="text-base font-medium">Theme presets</Label>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setTheme(preset.theme)}
                  className="overflow-hidden rounded-xl border-2 border-border transition-all hover:border-brand/50"
                >
                  <div className="flex h-16">
                    <div className="flex-1" style={{ backgroundColor: preset.theme.bg }} />
                    <div className="w-8" style={{ backgroundColor: preset.theme.button }} />
                  </div>
                  <p className="p-2 text-xs font-medium">{preset.name}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="space-y-5 p-5">
            <div>
              <Label className="text-base font-medium">Background</Label>
              <input
                type="color"
                value={theme.bg}
                onChange={(e) => setTheme({ bg: e.target.value })}
                className="mt-3 h-11 w-full cursor-pointer rounded-lg border border-border"
              />
            </div>
            <div>
              <Label className="text-base font-medium">Text color</Label>
              <input
                type="color"
                value={theme.text}
                onChange={(e) => setTheme({ text: e.target.value })}
                className="mt-3 h-11 w-full cursor-pointer rounded-lg border border-border"
              />
            </div>
            <div>
              <Label className="text-base font-medium">Button color</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {BUTTON_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setTheme({ button: color })}
                    className={cn(
                      "size-11 rounded-full border-2 transition-transform hover:scale-110",
                      theme.button === color ? "border-foreground scale-110" : "border-transparent",
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Button ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-medium">Button style</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTheme({ style })}
                    className={cn(
                      "rounded-full border px-4 py-2.5 text-sm font-medium capitalize min-h-[44px]",
                      theme.style === style ? "border-brand bg-brand/10 text-brand" : "border-border",
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="h-12 rounded-xl bg-brand-gradient px-8 text-base font-medium text-brand-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save appearance"}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border xl:sticky xl:top-20 xl:self-start">
          <div className="border-b border-border bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">
            Live preview
          </div>
          <div className="max-h-[75dvh] overflow-y-auto">
            <DbPublicProfileView profile={{ ...profile, theme }} links={activeLinks} />
          </div>
        </div>
      </div>
    </div>
  )
}

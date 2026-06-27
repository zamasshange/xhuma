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
  { name: "Dark", theme: { bg: "#0f0f0f", text: "#ffffff", button: "#7c3aed", radius: "14px" } },
  { name: "Ocean", theme: { bg: "#0f172a", text: "#e2e8f0", button: "#3b82f6", radius: "12px" } },
  { name: "Forest", theme: { bg: "#052e16", text: "#ecfdf5", button: "#22c55e", radius: "16px" } },
  { name: "Clean", theme: { bg: "#fafafa", text: "#171717", button: "#171717", radius: "14px" } },
]

const BUTTON_COLORS = ["#7c3aed", "#3b82f6", "#22c55e", "#f97316", "#ec4899", "#171717"]
const RADII = ["8px", "12px", "14px", "20px", "999px"]

export default function AppearancePage() {
  const { profile, links, loading, setProfile } = useDashboard()
  const [saving, setSaving] = useState(false)

  if (loading || !profile) return <p className="text-muted-foreground">Loading…</p>

  const theme = { ...DEFAULT_THEME, ...profile.theme_json }

  const setTheme = (patch: Partial<ProfileTheme>) => {
    setProfile({ ...profile, theme_json: { ...theme, ...patch } })
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
        <p className="mt-1 text-muted-foreground">Customize colors and button style.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <Label className="text-base font-medium">Presets</Label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setTheme(preset.theme)}
                  className="overflow-hidden rounded-xl border-2 border-border transition-all hover:border-brand/50"
                >
                  <div className="flex h-14">
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
              <Label>Background</Label>
              <input type="color" value={theme.bg} onChange={(e) => setTheme({ bg: e.target.value })} className="mt-2 h-11 w-full cursor-pointer rounded-lg border" />
            </div>
            <div>
              <Label>Text</Label>
              <input type="color" value={theme.text} onChange={(e) => setTheme({ text: e.target.value })} className="mt-2 h-11 w-full cursor-pointer rounded-lg border" />
            </div>
            <div>
              <Label>Button color</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {BUTTON_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setTheme({ button: color })}
                    className={cn("size-10 rounded-full border-2", theme.button === color ? "border-foreground scale-110" : "border-transparent")}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Corner radius</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {RADII.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTheme({ radius: r })}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm",
                      theme.radius === r ? "border-brand bg-brand/10 text-brand" : "border-border",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <button type="button" onClick={save} disabled={saving} className="h-12 rounded-xl bg-brand-gradient px-8 text-brand-foreground disabled:opacity-60">
            {saving ? "Saving…" : "Save appearance"}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="border-b bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">Preview</div>
          <DbPublicProfileView profile={{ ...profile, theme_json: theme }} links={activeLinks} />
        </div>
      </div>
    </div>
  )
}

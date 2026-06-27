"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api-fetch"
import type { DbLink } from "@/lib/database.types"
import { cn } from "@/lib/utils"

export default function LinksPage() {
  const { links, loading, refreshLinks, setLinks } = useDashboard()
  const [saving, setSaving] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, { title: string; url: string }>>({})

  if (loading) return <p className="text-muted-foreground">Loading links…</p>

  const getDraft = (link: DbLink) => drafts[link.id] ?? { title: link.title, url: link.url }

  const updateDraft = (id: string, patch: Partial<{ title: string; url: string }>) => {
    const link = links.find((l) => l.id === id)
    if (!link) return
    setDrafts((d) => ({ ...d, [id]: { ...getDraft(link), ...patch } }))
  }

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= links.length) return
    const reordered = [...links]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    const withPos = reordered.map((l, i) => ({ ...l, position: i }))
    setLinks(withPos)
    await apiFetch("/api/links", {
      method: "PATCH",
      body: JSON.stringify({ links: withPos.map((l) => ({ id: l.id, position: l.position })) }),
    })
  }

  const toggleActive = async (link: DbLink) => {
    const res = await apiFetch<DbLink>("/api/links", {
      method: "PATCH",
      body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
    })
    if (!res.success) {
      toast.error(res.error ?? "Update failed")
      return
    }
    await refreshLinks()
  }

  const remove = async (id: string) => {
    const res = await apiFetch(`/api/links?id=${id}`, { method: "DELETE" })
    if (!res.success) {
      toast.error(res.error ?? "Delete failed")
      return
    }
    await refreshLinks()
    toast.success("Link deleted")
  }

  const addLink = async () => {
    const res = await apiFetch<DbLink>("/api/links", {
      method: "POST",
      body: JSON.stringify({ title: "New link", url: "https://example.com" }),
    })
    if (!res.success) {
      toast.error(res.error ?? "Could not create link")
      return
    }
    await refreshLinks()
  }

  const saveAll = async () => {
    setSaving(true)
    for (const link of links) {
      const draft = getDraft(link)
      if (draft.title !== link.title || draft.url !== link.url) {
        await apiFetch("/api/links", {
          method: "PATCH",
          body: JSON.stringify({ id: link.id, title: draft.title, url: draft.url }),
        })
      }
    }
    setSaving(false)
    await refreshLinks()
    setDrafts({})
    toast.success("Links saved!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Links</h1>
          <p className="mt-1 text-muted-foreground">Reorder links and control visibility.</p>
        </div>
        <Button onClick={addLink} className="h-11 bg-brand-gradient text-brand-foreground">
          <Plus className="size-4" />
          Create link
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {links.map((link, index) => {
          const draft = getDraft(link)
          return (
            <Card key={link.id} className={cn("p-4", !link.is_active && "opacity-60")}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <button type="button" onClick={() => move(index, -1)} className="flex size-8 items-center justify-center rounded-lg hover:bg-muted" aria-label="Move up">
                    <ChevronUp className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} className="flex size-8 items-center justify-center rounded-lg hover:bg-muted" aria-label="Move down">
                    <ChevronDown className="size-4" />
                  </button>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <Badge variant="muted">{link.clicks.toLocaleString()} clicks</Badge>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label>Title</Label>
                      <Input
                        className="h-11 text-base"
                        value={draft.title}
                        onChange={(e) => updateDraft(link.id, { title: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>URL</Label>
                      <Input
                        className="h-11 text-base"
                        value={draft.url}
                        onChange={(e) => updateDraft(link.id, { url: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleActive(link)} className="h-10">
                      {link.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      {link.is_active ? "Visible" : "Hidden"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(link.id)} className="h-10">
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {links.length > 0 && (
        <Button
          onClick={saveAll}
          disabled={saving}
          className="sticky bottom-24 h-12 w-full bg-brand-gradient text-brand-foreground lg:static lg:w-auto lg:self-start lg:px-8"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      )}
    </div>
  )
}

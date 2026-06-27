"use client"

import { useEffect, useState } from "react"
import { ScaledPhonePreview } from "@/components/device/scaled-phone-preview"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { editorStateFromDocument } from "@/lib/editor-state"
import type { MarketplaceTemplate } from "@/lib/templates/catalog"
import type { DbProfile } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { apiFetch } from "@/lib/api-fetch"

/** Live thumbnail — real device proportions, scaled to fit the grid card */
export function TemplateCardPreview({ template }: { template: MarketplaceTemplate }) {
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const profileRes = await apiFetch<DbProfile | null>("/api/profile")
      if (cancelled) return
      if (profileRes.success && profileRes.data?.avatar_url) {
        setUserAvatar(profileRes.data.avatar_url)
        return
      }
      const draftRes = await apiFetch<{ data_json?: { profile?: { avatar_url?: string | null } } }>("/api/draft")
      if (!cancelled && draftRes.success && draftRes.data?.data_json?.profile?.avatar_url) {
        setUserAvatar(draftRes.data.data_json.profile.avatar_url)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const state = editorStateFromDocument(template.id, template.default_data)
  const previewProfile: DbProfile = {
    id: "preview",
    username: "preview",
    display_name: state.profile.display_name || template.name,
    bio: state.profile.bio || template.description,
    avatar_url: userAvatar ?? state.profile.avatar_url,
    theme_json: resolveThemeBackground(state.profile.theme),
    template_id: template.id,
    created_at: new Date().toISOString(),
  }
  const previewLinks = state.links
    .filter((l) => l.title.trim())
    .map((l) => ({ id: l.id, title: l.title || "Link", url: l.url || "#", icon: l.icon }))

  return (
    <div className="aspect-[9/19.5] w-full">
      <ScaledPhonePreview className="h-full">
        <DbPublicProfileView
          profile={previewProfile}
          links={previewLinks}
          pageSections={state.page_sections}
          density="device"
        />
      </ScaledPhonePreview>
    </div>
  )
}

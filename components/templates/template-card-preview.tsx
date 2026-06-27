"use client"

import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { editorStateFromDocument } from "@/lib/editor-state"
import type { MarketplaceTemplate } from "@/lib/templates/catalog"
import type { DbProfile } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"

/** Compact live thumbnail for 2-column mobile grid */
export function TemplateCardPreview({ template }: { template: MarketplaceTemplate }) {
  const state = editorStateFromDocument(template.id, template.default_data)
  const previewProfile: DbProfile = {
    id: "preview",
    username: "preview",
    display_name: state.profile.display_name || template.name,
    bio: state.profile.bio || template.description,
    avatar_url: state.profile.avatar_url,
    theme_json: resolveThemeBackground(state.profile.theme),
    template_id: template.id,
    created_at: new Date().toISOString(),
  }
  const previewLinks = state.links
    .filter((l) => l.title.trim())
    .map((l) => ({ id: l.id, title: l.title || "Link", url: l.url || "#", icon: l.icon }))

  return (
    <div className="flex items-center justify-center overflow-hidden bg-bio-grey-f4 px-1 py-2">
      <PhoneDeviceFrame size="thumb" showLabel={false} glow={false} className="mx-auto w-full">
        <DbPublicProfileView
          profile={previewProfile}
          links={previewLinks}
          pageSections={state.page_sections}
          density="device"
        />
      </PhoneDeviceFrame>
    </div>
  )
}

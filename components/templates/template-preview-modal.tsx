"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet, X } from "lucide-react"
import { PhoneDeviceFrame, type PhoneDeviceSize } from "@/components/device/phone-device-frame"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { editorStateFromDocument } from "@/lib/editor-state"
import type { MarketplaceTemplate } from "@/lib/templates/catalog"
import { BioButton } from "@/components/ui/bio-form"
import { cn } from "@/lib/utils"
import type { DbProfile } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"

type Device = "mobile" | "tablet" | "desktop"

const DEVICE_FRAME: Record<Device, PhoneDeviceSize> = {
  mobile: "preview",
  tablet: "md",
  desktop: "lg",
}

export function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: MarketplaceTemplate
  onClose: () => void
  onUse: () => void
}) {
  const [device, setDevice] = useState<Device>("mobile")

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
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-bio-dark/50 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-bio-dark/8 px-4 py-3">
          <div>
            <p className="font-semibold text-bio-dark">{template.name}</p>
            <p className="text-xs text-bio-grey">{template.category} · Preview only</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-bio-grey-f4">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 border-b border-bio-dark/8 px-4 py-2">
          {(
            [
              { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
              { id: "tablet" as const, icon: Tablet, label: "Tablet" },
              { id: "desktop" as const, icon: Monitor, label: "Desktop" },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold",
                device === d.id ? "bg-bio-dark text-white" : "text-bio-grey",
              )}
            >
              <d.icon className="size-3.5" />
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-start justify-center overflow-auto bg-bio-grey-f4 p-6 sm:p-8">
          <PhoneDeviceFrame size={DEVICE_FRAME[device]} showLabel={false} glow={device === "mobile"}>
            <DbPublicProfileView
              profile={previewProfile}
              links={previewLinks}
              pageSections={state.page_sections}
              density="device"
            />
          </PhoneDeviceFrame>
        </div>

        <div className="border-t border-bio-dark/8 p-4">
          <BioButton className="w-full" onClick={onUse}>
            Use this template
          </BioButton>
        </div>
      </div>
    </div>
  )
}

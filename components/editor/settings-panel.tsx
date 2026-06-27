"use client"

import { useEditor } from "@/components/editor/editor-provider"
import { BioCard, BioMuted, BioSectionTitle } from "@/components/ui/bio-form"
import { SITE_DOMAIN } from "@/lib/brand"

export function SettingsPanel() {
  const { profile, userId } = useEditor()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BioSectionTitle>Settings</BioSectionTitle>
        <BioMuted className="mt-1">Your device is linked to this page. No login required yet.</BioMuted>
      </div>

      <BioCard className="space-y-3 text-sm">
        <p className="text-bio-grey">
          Stored in your browser so you can edit your page on this device.
        </p>
        <code className="block break-all rounded-2xl border-2 border-bio-dark/10 bg-white p-3 text-xs text-bio-dark">
          {userId}
        </code>
        {profile && (
          <p className="text-bio-dark">
            Public page:{" "}
            <a href={`/${profile.username}`} className="font-semibold underline-offset-2 hover:underline">
              {SITE_DOMAIN}/{profile.username}
            </a>
          </p>
        )}
      </BioCard>
    </div>
  )
}

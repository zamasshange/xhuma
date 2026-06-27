"use client"

import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import { DEMO_SUMMER_LINKS, DEMO_SUMMER_PROFILE } from "@/lib/demo-profile"
import { cn } from "@/lib/utils"

export function PhonePreview({ className }: { className?: string }) {
  return (
    <PhoneDeviceFrame size="md" showLabel={false} className={cn(className)}>
      <DbPublicProfileView
        profile={DEMO_SUMMER_PROFILE}
        links={DEMO_SUMMER_LINKS}
        compact
        verified
      />
    </PhoneDeviceFrame>
  )
}

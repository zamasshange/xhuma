"use client"

import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import {
  DEMO_PREMIUM_LINKS,
  DEMO_PREMIUM_PROFILE,
} from "@/lib/demo-profile"
import { cn } from "@/lib/utils"

export function PhonePreview({ className }: { className?: string }) {
  return (
    <PhoneDeviceFrame size="md" showLabel={false} glow className={cn(className)}>
      <DbPublicProfileView
        profile={DEMO_PREMIUM_PROFILE}
        links={DEMO_PREMIUM_LINKS}
        compact
        verified
      />
    </PhoneDeviceFrame>
  )
}

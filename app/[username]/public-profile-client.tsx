"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import type { DbLink, DbProfile } from "@/lib/database.types"

export function PublicProfilePageClient({
  profile,
  links,
}: {
  profile: DbProfile
  links: Pick<DbLink, "id" | "title" | "url" | "icon">[]
}) {
  useEffect(() => {
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: profile.username }),
    }).catch(() => {})
  }, [profile.username])

  return (
    <DbPublicProfileView
      profile={profile}
      links={links}
      trackClicks
      onShare={() => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied!")
      }}
    />
  )
}

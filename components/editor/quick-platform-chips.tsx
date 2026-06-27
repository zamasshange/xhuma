"use client"

import { SocialIconBadge } from "@/components/icons/social-icon"
import type { SocialIconName } from "@/lib/infer-link-icon"

const QUICK_PLATFORMS: { icon: SocialIconName; label: string; title: string; url: string }[] = [
  { icon: "instagram", label: "Instagram", title: "Instagram", url: "https://www.instagram.com/" },
  { icon: "tiktok", label: "TikTok", title: "TikTok", url: "https://www.tiktok.com/@" },
  { icon: "youtube", label: "YouTube", title: "YouTube", url: "https://www.youtube.com/@" },
  { icon: "spotify", label: "Spotify", title: "Spotify", url: "https://open.spotify.com/artist/00000000000000000000000" },
  { icon: "x", label: "X", title: "X", url: "https://x.com/" },
  { icon: "linkedin", label: "LinkedIn", title: "LinkedIn", url: "https://www.linkedin.com/in/yourprofile" },
]

export function QuickPlatformChips({
  onAdd,
}: {
  onAdd: (title: string, url: string, icon: SocialIconName) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_PLATFORMS.map((p) => (
        <button
          key={p.icon}
          type="button"
          onClick={() => onAdd(p.title, p.url, p.icon)}
          className="flex items-center gap-2 rounded-lg border border-bio-dark/8 bg-white px-2.5 py-1.5 text-xs font-semibold text-bio-dark shadow-sm transition hover:border-bio-dark/15 hover:bg-bio-grey-f4 active:scale-[0.98]"
        >
          <SocialIconBadge icon={p.icon} size={24} className="rounded-md" />
          {p.label}
        </button>
      ))}
    </div>
  )
}

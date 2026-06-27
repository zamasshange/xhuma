"use client"

import { SocialIconBadge } from "@/components/icons/social-icon"
import type { SocialIconName } from "@/lib/infer-link-icon"

const QUICK_PLATFORMS: { icon: SocialIconName; label: string; title: string; url: string }[] = [
  { icon: "instagram", label: "Instagram", title: "Instagram", url: "https://instagram.com/" },
  { icon: "tiktok", label: "TikTok", title: "TikTok", url: "https://tiktok.com/@" },
  { icon: "youtube", label: "YouTube", title: "YouTube", url: "https://youtube.com/@" },
  { icon: "spotify", label: "Spotify", title: "Spotify", url: "https://open.spotify.com/" },
  { icon: "x", label: "X", title: "X", url: "https://x.com/" },
  { icon: "linkedin", label: "LinkedIn", title: "LinkedIn", url: "https://linkedin.com/in/" },
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
          className="flex items-center gap-2 rounded-full border border-bio-dark/8 bg-white px-3 py-1.5 text-xs font-semibold text-bio-dark shadow-sm transition hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
        >
          <SocialIconBadge icon={p.icon} size={26} className="rounded-full" />
          {p.label}
        </button>
      ))}
    </div>
  )
}

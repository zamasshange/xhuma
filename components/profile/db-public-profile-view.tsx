"use client"

import { Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"

export function DbPublicProfileView({
  profile,
  links,
  onShare,
  trackClicks = false,
}: {
  profile: DbProfile
  links: Pick<DbLink, "id" | "title" | "url">[]
  onShare?: () => void
  trackClicks?: boolean
}) {
  const theme = { ...DEFAULT_THEME, ...profile.theme_json }

  const handleClick = async (linkId: string) => {
    if (!trackClicks) return
    const res = await fetch(`/api/links/${linkId}/click`, { method: "POST" })
    const json = await res.json()
    if (json.success && json.data?.url) window.open(json.data.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <div className="relative mx-auto max-w-md px-4 pb-10 pt-8">
        {onShare && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="icon"
              className="size-11 rounded-full border-white/20 bg-white/10"
              onClick={onShare}
            >
              <Share2 className="size-4.5" />
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <Avatar
            src={profile.avatar_url ?? undefined}
            alt={profile.display_name}
            className="size-28 rounded-full border-4 border-white/20 shadow-xl"
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">{profile.display_name}</h1>
          {profile.bio && <p className="mt-3 max-w-sm text-base leading-relaxed opacity-90">{profile.bio}</p>}
        </motion.div>

        <div className="mt-8 flex flex-col gap-3">
          {links.map((link, i) => (
            <motion.button
              key={link.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => {
                if (trackClicks) handleClick(link.id)
                else window.open(link.url, "_blank", "noopener,noreferrer")
              }}
              className="flex w-full min-h-[52px] items-center justify-center px-4 py-3.5 text-base font-medium shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: theme.button,
                color: theme.text,
                borderRadius: theme.radius,
              }}
            >
              {link.title}
            </motion.button>
          ))}
        </div>

        <p className="mt-10 text-center text-xs opacity-50">Powered by Xhuma</p>
      </div>
    </div>
  )
}

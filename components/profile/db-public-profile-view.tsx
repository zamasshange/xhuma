"use client"

import { Share2, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"

function ProfileLinkButton({
  title,
  theme,
  onClick,
  delay,
}: {
  title: string
  theme: typeof DEFAULT_THEME
  onClick: () => void
  delay: number
}) {
  const buttonText = theme.button_text ?? theme.text
  const isWavy = theme.button_style === "wavy"
  const isPill = theme.button_style === "pill" || theme.radius === "999px"

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "flex w-full min-h-[48px] items-center justify-center px-4 py-3 text-[15px] shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]",
        isWavy && "profile-link-wavy font-bold italic",
        isPill && "rounded-full",
        !isWavy && !isPill && "font-medium",
      )}
      style={{
        backgroundColor: theme.button,
        color: buttonText,
        borderRadius: isWavy ? undefined : isPill ? "999px" : theme.radius,
      }}
    >
      {title}
    </motion.button>
  )
}

export function DbPublicProfileView({
  profile,
  links,
  onShare,
  trackClicks = false,
  compact = false,
  verified = false,
}: {
  profile: DbProfile
  links: Pick<DbLink, "id" | "title" | "url">[]
  onShare?: () => void
  trackClicks?: boolean
  /** Tighter layout inside device frame */
  compact?: boolean
  verified?: boolean
}) {
  const theme = { ...DEFAULT_THEME, ...profile.theme_json }

  const handleClick = async (linkId: string, url: string) => {
    if (trackClicks) {
      const res = await fetch(`/api/links/${linkId}/click`, { method: "POST" })
      const json = await res.json()
      if (json.success && json.data?.url) window.open(json.data.url, "_blank", "noopener,noreferrer")
      return
    }
    if (url !== "#") window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn("min-h-full", compact ? "min-h-[480px]" : "min-h-dvh")}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div
        className={cn(
          "relative mx-auto max-w-md px-4 pb-12",
          compact ? "pt-12" : "pb-10 pt-8",
        )}
      >
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
            className={cn(
              "rounded-full border-4 border-white/25 shadow-xl",
              compact ? "size-24" : "size-28",
            )}
          />
          <h1
            className={cn(
              "mt-4 flex items-center justify-center gap-1.5 font-heading font-semibold tracking-tight",
              compact ? "text-2xl" : "text-3xl",
            )}
          >
            {profile.display_name}
            {verified && <BadgeCheck className="size-5 shrink-0 text-sky-300" aria-label="Verified" />}
          </h1>
          {profile.bio && (
            <p className={cn("mt-2 max-w-sm leading-relaxed opacity-90", compact ? "text-sm" : "text-base")}>
              {profile.bio}
            </p>
          )}
        </motion.div>

        <div className={cn("flex flex-col", compact ? "mt-6 gap-2.5" : "mt-8 gap-3")}>
          {links.map((link, i) => (
            <ProfileLinkButton
              key={link.id}
              title={link.title}
              theme={theme}
              delay={0.05 * i}
              onClick={() => handleClick(link.id, link.url)}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] opacity-45">Powered by Xhuma</p>
      </div>
    </div>
  )
}

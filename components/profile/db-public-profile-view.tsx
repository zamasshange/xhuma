"use client"

import { Share2, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SocialIcon, SocialIconRow, resolveLinkIcon } from "@/components/icons/social-icon"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { themeForRender } from "@/lib/database.types"

function ProfileLinkButton({
  title,
  icon,
  theme,
  onClick,
  delay,
  staticPreview,
}: {
  title: string
  icon?: string | null
  theme: typeof DEFAULT_THEME
  onClick: () => void
  delay: number
  staticPreview?: boolean
}) {
  const buttonText = theme.button_text ?? theme.text
  const isWavy = theme.button_style === "wavy"
  const isPill = theme.button_style === "pill" || theme.radius === "999px"
  const displayIcon = resolveLinkIcon(icon, title)

  const className = cn(
    "flex w-full min-h-[48px] items-center justify-center gap-2.5 px-4 py-3 text-[15px]",
    !staticPreview && "transition-transform hover:scale-[1.01] active:scale-[0.99]",
    isWavy && "profile-link-wavy font-bold italic shadow-sm",
    isPill && "rounded-full",
    !isWavy && !isPill && "rounded-2xl font-medium shadow-sm",
  )

  const style = {
    backgroundColor: theme.button,
    color: buttonText,
    borderRadius: isWavy ? undefined : isPill ? "999px" : theme.radius,
  }

  const content = (
    <>
      <SocialIcon name={displayIcon} size={18} color={buttonText} />
      <span>{title}</span>
    </>
  )

  if (staticPreview) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        {content}
      </button>
    )
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={className}
      style={style}
    >
      {content}
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
  links: Pick<DbLink, "id" | "title" | "url" | "icon">[]
  onShare?: () => void
  trackClicks?: boolean
  /** Tighter layout inside device frame */
  compact?: boolean
  verified?: boolean
}) {
  const theme = themeForRender({ ...DEFAULT_THEME, ...profile.theme_json })
  const staticPreview = compact

  const handleClick = async (linkId: string, url: string) => {
    if (trackClicks) {
      const res = await fetch(`/api/links/${linkId}/click`, { method: "POST" })
      const json = await res.json()
      if (json.success && json.data?.url) window.open(json.data.url, "_blank", "noopener,noreferrer")
      return
    }
    if (url !== "#") window.open(url, "_blank", "noopener,noreferrer")
  }

  const header = (
    <>
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

      <div className="flex flex-col items-center text-center">
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
        <SocialIconRow
          icons={links.map((l) => resolveLinkIcon(l.icon, l.title, l.url))}
          className={cn("opacity-90", compact ? "mt-3" : "mt-4")}
          size={compact ? 18 : 20}
        />
      </div>
    </>
  )

  return (
    <div
      className={cn("relative isolate w-full", compact ? "min-h-full" : "min-h-dvh")}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      <div
        className={cn(
          "relative mx-auto max-w-md px-4 pb-12",
          compact ? "pt-12" : "pb-10 pt-8",
        )}
      >
        {staticPreview ? (
          header
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {header}
          </motion.div>
        )}

        <div className={cn("flex flex-col overflow-hidden", compact ? "mt-6 gap-2.5" : "mt-8 gap-3")}>
          {links.map((link, i) => (
            <ProfileLinkButton
              key={link.id}
              title={link.title}
              icon={resolveLinkIcon(link.icon, link.title, link.url)}
              theme={theme}
              delay={0.05 * i}
              staticPreview={staticPreview}
              onClick={() => handleClick(link.id, link.url)}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] opacity-45">Powered by Xhuma</p>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { SocialIcon, resolveLinkIcon } from "@/components/icons/social-icon"
import type { ProfileTheme } from "@/lib/database.types"
import {
  linkCardClasses,
  linkCardInlineStyle,
  resolveLinkButtonColors,
  resolveLinkCardStyle,
} from "@/lib/link-card-styles"
import { cn } from "@/lib/utils"
import type { ProfileViewDensity } from "@/lib/profile-view-density"
import { resolveProfileDensity } from "@/lib/profile-view-density"

export function ProfileLinkButton({
  title,
  icon,
  theme,
  onClick,
  delay = 0,
  staticPreview = false,
  density,
  compact,
}: {
  title: string
  icon?: string | null
  theme: ProfileTheme
  onClick: () => void
  delay?: number
  staticPreview?: boolean
  density?: ProfileViewDensity
  /** @deprecated Use density */
  compact?: boolean
}) {
  const viewDensity = resolveProfileDensity(density, compact)
  const isCompact = viewDensity === "compact"
  const isDevice = viewDensity === "device"
  const styleId = resolveLinkCardStyle(theme)
  const displayIcon = resolveLinkIcon(icon, title)
  const { text: iconColor } = resolveLinkButtonColors(theme)

  const className = cn(
    "flex w-full items-center justify-center gap-2 px-3",
    isCompact && "min-h-[34px] py-1.5 text-[11px]",
    isDevice && "min-h-[44px] py-2.5 text-[13px] gap-2 px-3.5",
    viewDensity === "full" && "min-h-[48px] py-3 text-[15px] gap-2.5 px-4",
    !staticPreview && "transition-transform hover:scale-[1.01] active:scale-[0.99]",
    linkCardClasses(styleId),
  )

  const style = linkCardInlineStyle(styleId, theme)

  const content = (
    <>
      <SocialIcon
        name={displayIcon}
        size={isCompact ? 14 : isDevice ? 16 : 18}
        color={iconColor}
      />
      <span className="truncate">{title}</span>
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

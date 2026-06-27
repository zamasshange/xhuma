"use client"

import { motion } from "framer-motion"
import { SocialIcon, resolveLinkIcon } from "@/components/icons/social-icon"
import type { ProfileTheme } from "@/lib/database.types"
import {
  linkCardClasses,
  linkCardInlineStyle,
  resolveLinkCardStyle,
} from "@/lib/link-card-styles"
import { cn } from "@/lib/utils"

export function ProfileLinkButton({
  title,
  icon,
  theme,
  onClick,
  delay = 0,
  staticPreview = false,
}: {
  title: string
  icon?: string | null
  theme: ProfileTheme
  onClick: () => void
  delay?: number
  staticPreview?: boolean
}) {
  const styleId = resolveLinkCardStyle(theme)
  const buttonText = theme.button_text ?? theme.text
  const displayIcon = resolveLinkIcon(icon, title)

  const className = cn(
    "flex w-full min-h-[48px] items-center justify-center gap-2.5 px-4 py-3 text-[15px]",
    !staticPreview && "transition-transform hover:scale-[1.01] active:scale-[0.99]",
    linkCardClasses(styleId),
  )

  const style = linkCardInlineStyle(styleId, theme)

  const content = (
    <>
      <SocialIcon name={displayIcon} size={18} color={style.color ?? buttonText} />
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

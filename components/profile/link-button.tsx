"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"

const radiusMap = { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-2xl", full: "rounded-full" }
const styleMap = {
  solid: "bg-[var(--link-accent)] text-white border-transparent",
  outline: "border-2 border-[var(--link-accent)] text-[var(--link-accent)] bg-transparent",
  soft: "bg-[var(--link-accent)]/15 text-[var(--link-accent)] border-transparent",
  glass: "border border-white/20 bg-white/10 text-foreground backdrop-blur-md",
}

export function LinkButton({
  title,
  description,
  icon,
  accent = "#7c5cff",
  buttonStyle = "glass",
  buttonRadius = "lg",
  pinned,
  onClick,
  className,
}: {
  title: string
  description?: string
  icon: string
  accent?: string
  buttonStyle?: keyof typeof styleMap
  buttonRadius?: keyof typeof radiusMap
  pinned?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex w-full min-h-[52px] items-center gap-3 border px-4 py-3.5 text-left shadow-sm transition-shadow hover:shadow-md",
        radiusMap[buttonRadius],
        styleMap[buttonStyle],
        className,
      )}
      style={{ "--link-accent": accent } as React.CSSProperties}
    >
      {pinned && (
        <span className="absolute -top-2 left-4 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
          Pinned
        </span>
      )}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/10">
        <Icon name={icon} className="size-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium">{title}</span>
        {description && (
          <span className="mt-0.5 block truncate text-sm opacity-80">{description}</span>
        )}
      </span>
    </motion.button>
  )
}

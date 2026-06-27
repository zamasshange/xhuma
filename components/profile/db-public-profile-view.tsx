"use client"

import { Share2, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SocialIconRow, resolveLinkIcon } from "@/components/icons/social-icon"
import { ProfileLinkButton } from "@/components/profile/profile-link-button"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { DEFAULT_THEME } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { resolveLinkButtonColors } from "@/lib/link-card-styles"
import { ProfileSectionBlocks } from "@/components/profile/profile-section-blocks"
import type { PageSection } from "@/lib/editor-sections"
import { normalizePageSections } from "@/lib/editor-sections"

const PRESET_DECOR_CLASS: Record<string, string> = {
  summer: "profile-theme-summer",
  xmas: "profile-theme-xmas",
  pride: "profile-theme-pride",
  rainy: "profile-theme-rainy",
  strawberry: "profile-theme-strawberry",
  chameleon: "profile-theme-chameleon",
  desert: "profile-theme-desert",
}

export function DbPublicProfileView({
  profile,
  links,
  pageSections,
  onShare,
  trackClicks = false,
  compact = false,
  verified = false,
}: {
  profile: DbProfile
  links: Pick<DbLink, "id" | "title" | "url" | "icon">[]
  pageSections?: PageSection[]
  onShare?: () => void
  trackClicks?: boolean
  /** Tighter layout inside device frame */
  compact?: boolean
  verified?: boolean
}) {
  const theme = resolveThemeBackground({ ...DEFAULT_THEME, ...profile.theme_json })
  const sections =
    pageSections ??
    (theme.page_sections?.length
      ? normalizePageSections(theme.page_sections)
      : undefined)
  const linkColors = resolveLinkButtonColors(theme)
  const useThemeIcons = theme.social_icon_style === "theme"
  const decorClass =
    !theme.bg_image && theme.preset_id ? PRESET_DECOR_CLASS[theme.preset_id] : undefined
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
          src={profile.avatar_url || undefined}
          alt={profile.display_name}
          fallback={(profile.display_name || "You").slice(0, 2).toUpperCase()}
          className={cn(
            "rounded-full border-4 border-white/25 bg-black/20 shadow-xl",
            compact ? "size-[52px] border-2" : "size-28",
          )}
        />
        <h1
          className={cn(
            "flex items-center justify-center gap-1.5 font-heading font-semibold tracking-tight",
            compact ? "mt-2 text-base" : "mt-4 text-3xl",
          )}
        >
          {profile.display_name}
          {verified && (
            <BadgeCheck className={cn("shrink-0 text-sky-300", compact ? "size-3.5" : "size-5")} aria-label="Verified" />
          )}
        </h1>
        {profile.bio && (
          <p
            className={cn(
              "max-w-sm leading-relaxed opacity-90",
              compact ? "mt-1 line-clamp-2 text-[10px]" : "mt-2 text-base",
            )}
          >
            {profile.bio}
          </p>
        )}
        <SocialIconRow
          icons={links.map((l) => resolveLinkIcon(l.icon, l.title, l.url))}
          className={cn("opacity-90", compact ? "mt-2" : "mt-4")}
          size={compact ? 14 : 20}
          badgeSize={compact ? 24 : undefined}
          variant={useThemeIcons ? "theme" : "badge"}
          themeColors={useThemeIcons ? linkColors : undefined}
        />
      </div>
    </>
  )

  return (
    <div
      className={cn(
        "relative isolate w-full",
        compact ? "min-h-0" : "min-h-dvh overflow-hidden",
        decorClass,
      )}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {theme.bg_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={theme.bg_image}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      )}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-md",
          compact ? "px-2.5 pb-4 pt-9" : "px-4 pb-10 pt-8",
        )}
      >
        {staticPreview ? (
          header
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {header}
          </motion.div>
        )}

        <div className={cn("flex flex-col", compact ? "mt-3 gap-1.5" : "mt-8 gap-3")}>
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

        {sections && (
          <ProfileSectionBlocks
            sections={sections}
            theme={theme}
            compact={compact}
            onLinkClick={(url) => {
              if (url !== "#") window.open(url, "_blank", "noopener,noreferrer")
            }}
          />
        )}

        {!compact && <p className="mt-8 text-center text-[10px] opacity-45">Powered by Xhuma</p>}
      </div>
    </div>
  )
}

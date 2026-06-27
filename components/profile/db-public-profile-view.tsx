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
import { resolveProfileDensity, type ProfileViewDensity } from "@/lib/profile-view-density"

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
  density,
  verified = false,
}: {
  profile: DbProfile
  links: Pick<DbLink, "id" | "title" | "url" | "icon">[]
  pageSections?: PageSection[]
  onShare?: () => void
  trackClicks?: boolean
  /** @deprecated Use density="compact" */
  compact?: boolean
  /** full = live page; device = phone frame preview; compact = tiny thumbnail */
  density?: ProfileViewDensity
  verified?: boolean
}) {
  const viewDensity = resolveProfileDensity(density, compact)
  const isDevice = viewDensity === "device"
  const isCompact = viewDensity === "compact"
  const isFull = viewDensity === "full"
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
  const staticPreview = !isFull

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
            isCompact && "size-[52px] border-2",
            isDevice && "size-[72px] border-[3px]",
            isFull && "size-28",
          )}
        />
        <h1
          className={cn(
            "flex items-center justify-center gap-1.5 font-heading font-semibold tracking-tight",
            isCompact && "mt-2 text-base",
            isDevice && "mt-3 text-[17px] leading-tight",
            isFull && "mt-4 text-3xl",
          )}
        >
          {profile.display_name}
          {verified && (
            <BadgeCheck
              className={cn(
                "shrink-0 text-sky-300",
                isCompact && "size-3.5",
                isDevice && "size-4",
                isFull && "size-5",
              )}
              aria-label="Verified"
            />
          )}
        </h1>
        {profile.bio && (
          <p
            className={cn(
              "max-w-sm leading-relaxed opacity-90",
              isCompact && "mt-1 line-clamp-2 text-[10px]",
              isDevice && "mt-1.5 line-clamp-3 px-1 text-[12px] leading-snug",
              isFull && "mt-2 text-base",
            )}
          >
            {profile.bio}
          </p>
        )}
        <SocialIconRow
          icons={links.map((l) => resolveLinkIcon(l.icon, l.title, l.url))}
          className={cn("opacity-90", isCompact && "mt-2", isDevice && "mt-3", isFull && "mt-4")}
          size={isCompact ? 14 : isDevice ? 17 : 20}
          badgeSize={isCompact ? 24 : isDevice ? 28 : undefined}
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
        isFull ? "min-h-dvh overflow-hidden" : "min-h-0",
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
          "relative z-10 mx-auto w-full max-w-md",
          isCompact && "px-2.5 pb-4 pt-9",
          isDevice && "px-4 pb-6 pt-11",
          isFull && "px-4 pb-10 pt-8",
        )}
      >
        {staticPreview ? (
          header
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {header}
          </motion.div>
        )}

        <div
          className={cn(
            "flex flex-col",
            isCompact && "mt-3 gap-1.5",
            isDevice && "mt-4 gap-2",
            isFull && "mt-8 gap-3",
          )}
        >
          {links.map((link, i) => (
            <ProfileLinkButton
              key={link.id}
              title={link.title}
              icon={resolveLinkIcon(link.icon, link.title, link.url)}
              theme={theme}
              delay={0.05 * i}
              density={viewDensity}
              staticPreview={staticPreview}
              onClick={() => handleClick(link.id, link.url)}
            />
          ))}
        </div>

        {sections && (
          <ProfileSectionBlocks
            sections={sections}
            theme={theme}
            density={viewDensity}
            onLinkClick={(url) => {
              if (url !== "#") window.open(url, "_blank", "noopener,noreferrer")
            }}
          />
        )}

        {isFull && <p className="mt-8 text-center text-[10px] opacity-45">Powered by Xhuma</p>}
      </div>
    </div>
  )
}

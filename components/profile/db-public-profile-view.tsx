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
import { normalizeUrl } from "@/lib/normalize-url"

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
  const isFramePreview = isDevice || isCompact

  const handleLinkClick = (linkId: string) => {
    if (trackClicks) {
      fetch(`/api/links/${linkId}/click`, { method: "POST" }).catch(() => {})
    }
  }

  const linkHref = (url: string) => {
    const trimmed = url.trim()
    if (!trimmed || trimmed === "#") return undefined
    return normalizeUrl(trimmed)
  }

  const header = (
    <div className="flex flex-col items-center text-center">
      <Avatar
        src={profile.avatar_url || undefined}
        alt={profile.display_name}
        fallback={(profile.display_name || "You").slice(0, 2).toUpperCase()}
        className={cn(
          "rounded-full border-4 border-white/30 bg-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
          isCompact && "size-[52px] border-2",
          isDevice && "size-[72px] border-[3px]",
          isFull && "size-[104px] border-[3px] sm:size-28",
        )}
      />
      <h1
        className={cn(
          "flex items-center justify-center gap-1.5 font-heading font-semibold tracking-tight",
          isCompact && "mt-2 text-base",
          isDevice && "mt-3 text-[17px] leading-tight",
          isFull && "mt-5 text-[1.75rem] leading-tight sm:text-3xl",
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
            isFull && "mt-3 max-w-[26ch] text-pretty text-base leading-relaxed sm:max-w-sm",
          )}
        >
          {profile.bio}
        </p>
      )}
      {links.length > 0 && (
        <SocialIconRow
          icons={links.map((l) => resolveLinkIcon(l.icon, l.title, l.url))}
          className={cn("opacity-90", isCompact && "mt-2", isDevice && "mt-3", isFull && "mt-5")}
          size={isCompact ? 14 : isDevice ? 17 : 20}
          badgeSize={isCompact ? 24 : isDevice ? 28 : undefined}
          variant={staticPreview ? "plain" : useThemeIcons ? "theme" : "badge"}
          themeColors={useThemeIcons ? linkColors : undefined}
        />
      )}
    </div>
  )

  const linkList = (
    <div
      className={cn(
        "flex w-full flex-col",
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
          href={isFull ? linkHref(link.url) : undefined}
          delay={0.05 * i}
          density={viewDensity}
          staticPreview={staticPreview}
          onClick={
            isFull && linkHref(link.url)
              ? () => handleLinkClick(link.id)
              : () => {
                  const href = linkHref(link.url)
                  if (href) window.open(href, "_blank", "noopener,noreferrer")
                }
          }
        />
      ))}
    </div>
  )

  return (
    <div
      className={cn(
        "relative isolate w-full",
        isFull ? "flex min-h-dvh flex-col overflow-hidden" : isFramePreview && "flex min-h-full flex-col",
        !isFull && !isFramePreview && "min-h-0",
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
          className="pointer-events-none absolute inset-0 size-full object-cover object-center"
        />
      )}
      {isFull && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[0.06] via-transparent to-black/[0.12]"
          aria-hidden
        />
      )}

      {onShare && isFull && (
        <div className="fixed right-4 top-4 z-30 pt-[env(safe-area-inset-top)]">
          <Button
            variant="outline"
            size="icon"
            className="size-11 rounded-full border-white/25 bg-white/15 text-inherit backdrop-blur-sm hover:bg-white/25"
            onClick={onShare}
            aria-label="Share profile"
          >
            <Share2 className="size-4.5" />
          </Button>
        </div>
      )}

      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-md",
          isFramePreview && "flex min-h-full flex-1 flex-col justify-center",
          isCompact && "px-2.5 pb-4 pt-9",
          isDevice && "px-4 py-8 pt-11",
          isFull && "flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-6 sm:py-20",
        )}
      >
        {onShare && !isFull && (
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

        <div className={cn(isFull && "w-full")}>
          {staticPreview ? (
            header
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {header}
            </motion.div>
          )}

          {links.length > 0 ? (
            staticPreview ? (
              linkList
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                {linkList}
              </motion.div>
            )
          ) : isFull ? (
            <p className="mt-8 text-center text-sm opacity-60">No links yet</p>
          ) : null}

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
        </div>

        {isFull && (
          <p className="mt-10 w-full text-center text-xs font-medium opacity-55 sm:mt-12">
            Powered by Xhuma
          </p>
        )}
      </div>
    </div>
  )
}

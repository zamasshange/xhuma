"use client"

import type { PageSection } from "@/lib/editor-sections"
import { ProfileLinkButton } from "@/components/profile/profile-link-button"
import { resolveLinkIcon } from "@/components/icons/social-icon"
import type { ProfileTheme } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import type { ProfileViewDensity } from "@/lib/profile-view-density"
import { resolveProfileDensity } from "@/lib/profile-view-density"

type Item = { title?: string; description?: string; quote?: string; author?: string; q?: string; a?: string; price?: string }

export function ProfileSectionBlocks({
  sections,
  theme,
  density,
  compact,
  onLinkClick,
}: {
  sections: PageSection[]
  theme: ProfileTheme
  density?: ProfileViewDensity
  /** @deprecated Use density */
  compact?: boolean
  onLinkClick?: (url: string) => void
}) {
  const viewDensity = resolveProfileDensity(density, compact)
  const isCompact = viewDensity === "compact"
  const isDevice = viewDensity === "device"
  const skip = new Set(["profile", "links", "social_icons"])
  const blocks = sections.filter((s) => !skip.has(s.type))

  if (blocks.length === 0) return null

  return (
    <div
      className={cn(
        "flex flex-col",
        isCompact && "mt-3 gap-2",
        isDevice && "mt-4 gap-2.5",
        viewDensity === "full" && "mt-6 gap-4",
      )}
    >
      {blocks.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          theme={theme}
          density={viewDensity}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  )
}

function SectionBlock({
  section,
  theme,
  density,
  onLinkClick,
}: {
  section: PageSection
  theme: ProfileTheme
  density: ProfileViewDensity
  onLinkClick?: (url: string) => void
}) {
  const c = section.content
  const isCompact = density === "compact"
  const isDevice = density === "device"
  const pad = isCompact ? "p-2.5" : isDevice ? "p-3" : "p-4"
  const textSize = isCompact ? "text-[10px]" : isDevice ? "text-[12px]" : "text-sm"

  switch (section.type) {
    case "about":
      return (
        <div className={cn("rounded-xl bg-black/10", pad)}>
          <p className={cn("font-semibold opacity-90", textSize)}>{section.title ?? "About"}</p>
          <p className={cn("mt-1 leading-relaxed opacity-80", textSize)}>{String(c.body ?? "")}</p>
        </div>
      )
    case "testimonials": {
      const items = (c.items as Item[]) ?? []
      return (
        <div className={cn("rounded-xl bg-black/10", pad)}>
          <p className={cn("mb-2 font-semibold", textSize)}>Testimonials</p>
          {items.map((item, i) => (
            <blockquote key={i} className={cn("border-l-2 border-white/30 pl-2 opacity-90", textSize, i > 0 && "mt-2")}>
              &ldquo;{item.quote}&rdquo; — {item.author}
            </blockquote>
          ))}
        </div>
      )
    }
    case "services":
    case "pricing": {
      const items = (c.items as Item[]) ?? []
      return (
        <div className={cn("rounded-xl bg-black/10", pad)}>
          <p className={cn("mb-2 font-semibold", textSize)}>{section.title ?? section.type}</p>
          {items.map((item, i) => (
            <div key={i} className={cn("flex justify-between gap-2", textSize, i > 0 && "mt-1.5 border-t border-white/10 pt-1.5")}>
              <span className="font-medium">{item.title}</span>
              {item.price && <span className="opacity-80">{item.price}</span>}
            </div>
          ))}
        </div>
      )
    }
    case "faq": {
      const items = (c.items as Item[]) ?? []
      return (
        <div className={cn("rounded-xl bg-black/10", pad)}>
          <p className={cn("mb-2 font-semibold", textSize)}>FAQ</p>
          {items.map((item, i) => (
            <div key={i} className={cn(textSize, i > 0 && "mt-2")}>
              <p className="font-medium">{item.q}</p>
              <p className="opacity-75">{item.a}</p>
            </div>
          ))}
        </div>
      )
    }
    case "whatsapp":
    case "booking":
    case "donation":
      return (
        <ProfileLinkButton
          title={String(c.cta ?? section.title ?? "Contact")}
          icon={section.type === "whatsapp" ? "whatsapp" : "link"}
          theme={theme}
          density={density}
          staticPreview={density !== "full"}
          onClick={() => onLinkClick?.(String(c.url ?? "#"))}
        />
      )
    default:
      return (
        <div className={cn("rounded-xl bg-black/10 opacity-80", pad, textSize)}>
          {section.title ?? section.type}
        </div>
      )
  }
}

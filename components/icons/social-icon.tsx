import type { ComponentType, SVGProps } from "react"
import {
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiSpotify,
  SiX,
  SiFacebook,
  SiSnapchat,
  SiGithub,
  SiWhatsapp,
  SiBuymeacoffee,
} from "@icons-pack/react-simple-icons"
import { FaCoffee, FaGlobe, FaLink, FaLinkedin } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { inferLinkIcon, type SocialIconName } from "@/lib/infer-link-icon"

export type { SocialIconName } from "@/lib/infer-link-icon"

type IconProps = { size?: number; color?: string; className?: string }

function wrapSimple(
  Icon: ComponentType<{ size?: number; color?: string; title?: string; className?: string }>,
): ComponentType<IconProps> {
  return function Wrapped({ size = 20, color = "currentColor", className }: IconProps) {
    return <Icon size={size} color={color} className={className} />
  }
}

function wrapFa(Icon: ComponentType<SVGProps<SVGSVGElement>>): ComponentType<IconProps> {
  return function Wrapped({ size = 20, color = "currentColor", className }: IconProps) {
    return <Icon size={size} color={color} className={className} aria-hidden />
  }
}

const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  instagram: wrapSimple(SiInstagram),
  tiktok: wrapSimple(SiTiktok),
  youtube: wrapSimple(SiYoutube),
  spotify: wrapSimple(SiSpotify),
  x: wrapSimple(SiX),
  twitter: wrapSimple(SiX),
  facebook: wrapSimple(SiFacebook),
  snapchat: wrapSimple(SiSnapchat),
  linkedin: wrapFa(FaLinkedin),
  github: wrapSimple(SiGithub),
  whatsapp: wrapSimple(SiWhatsapp),
  coffee: wrapFa(FaCoffee),
  buymeacoffee: wrapSimple(SiBuymeacoffee),
  website: wrapFa(FaGlobe),
  globe: wrapFa(FaGlobe),
  link: wrapFa(FaLink),
}

export const SOCIAL_BRAND_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  tiktok: "#000000",
  youtube: "#FF0000",
  spotify: "#1DB954",
  x: "#000000",
  twitter: "#000000",
  facebook: "#1877F2",
  snapchat: "#FFFC00",
  linkedin: "#0A66C2",
  github: "#181717",
  whatsapp: "#25D366",
  coffee: "#FFDD00",
  buymeacoffee: "#FFDD00",
  website: "#6366F1",
  globe: "#6366F1",
  link: "#64748B",
}

export function resolveLinkIcon(
  stored?: string | null,
  title?: string | null,
  url?: string | null,
): SocialIconName {
  return resolveSocialIconName(stored) ?? inferLinkIcon(title, url) ?? "link"
}

export function resolveSocialIconName(name?: string | null): SocialIconName | null {
  if (!name) return null
  const key = name.toLowerCase().trim()
  if (key in ICON_MAP) return key as SocialIconName
  if (key === "buy-me-a-coffee" || key === "buymeacoffee") return "buymeacoffee"
  return null
}

export function SocialIcon({
  name,
  size = 20,
  color = "currentColor",
  className,
}: {
  name: string
  size?: number
  color?: string
  className?: string
}) {
  const resolved = resolveSocialIconName(name) ?? inferLinkIcon(name) ?? "link"
  const Icon = ICON_MAP[resolved] ?? ICON_MAP.link
  return <Icon size={size} color={color} className={cn("shrink-0", className)} />
}

export function SocialIconBadge({
  icon,
  size = 44,
  className,
}: {
  icon: string
  size?: number
  className?: string
}) {
  const resolved =
    resolveSocialIconName(icon) ?? inferLinkIcon(icon) ?? ("link" as SocialIconName)
  const bg = SOCIAL_BRAND_COLORS[resolved] ?? SOCIAL_BRAND_COLORS.link
  const lightIcon = resolved === "snapchat" || resolved === "coffee" || resolved === "buymeacoffee"
  const iconColor = lightIcon ? "#0d0c22" : "#ffffff"

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl shadow-[0_4px_14px_rgba(13,12,34,0.12)] ring-1 ring-black/5",
        className,
      )}
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <SocialIcon name={resolved} size={Math.round(size * 0.48)} color={iconColor} />
    </span>
  )
}

export function SocialIconRow({
  icons,
  className,
  size = 20,
  variant = "badge",
}: {
  icons: string[]
  className?: string
  size?: number
  variant?: "plain" | "badge"
}) {
  const unique = [
    ...new Set(
      icons.map((i) => resolveLinkIcon(i)).filter((i) => i !== "link"),
    ),
  ]
  if (unique.length === 0) return null

  if (variant === "badge") {
    return (
      <div className={cn("flex items-center justify-center gap-2.5", className)}>
        {unique.map((icon) => (
          <SocialIconBadge key={icon} icon={icon} size={Math.max(size * 1.6, 32)} className="rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {unique.map((icon) => (
        <SocialIcon key={icon} name={icon} size={size} />
      ))}
    </div>
  )
}

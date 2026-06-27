import Image from "next/image"
import { brandLogo } from "@/lib/brand-assets"

const LOGO_ASPECT = brandLogo.width / brandLogo.height

/** Fit wordmark inside height + max-width (wide logos need a width cap) */
export function logoDisplaySize(height: number, maxWidth: number) {
  const naturalWidth = height * LOGO_ASPECT
  if (naturalWidth <= maxWidth) {
    return { width: Math.round(naturalWidth), height }
  }
  const width = maxWidth
  return { width, height: Math.round(maxWidth / LOGO_ASPECT) }
}

export function BrandLogoImage({
  height = 28,
  maxWidth = 120,
  alt = "Xhuma",
}: {
  height?: number
  /** Caps horizontal space — wordmark is ~8:1 aspect ratio */
  maxWidth?: number
  alt?: string
  /** @deprecated ignored */
  scale?: number
  /** @deprecated ignored */
  widthRatio?: number
}) {
  const { width, height: displayHeight } = logoDisplaySize(height, maxWidth)

  return (
    <span
      className="inline-flex shrink-0 items-center"
      style={{ width, height: displayHeight }}
    >
      <Image
        src={brandLogo}
        alt={alt}
        width={width}
        height={displayHeight}
        className="size-full object-contain object-left"
        priority
      />
    </span>
  )
}

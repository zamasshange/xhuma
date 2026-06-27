import Image from "next/image"
import { brandLogo } from "@/lib/brand-assets"

/** Wordmark sits in the center of a large square PNG — light zoom + clip. */
const WORDMARK_SCALE = 3.2
const WIDTH_RATIO = 3.5

export function BrandLogoImage({
  height = 36,
  alt = "",
  scale = WORDMARK_SCALE,
  widthRatio = WIDTH_RATIO,
}: {
  height?: number
  alt?: string
  scale?: number
  widthRatio?: number
}) {
  const imageHeight = Math.round(height * scale)
  const width = Math.round(height * widthRatio)

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden"
      style={{ height, width }}
    >
      <Image
        src={brandLogo}
        alt={alt}
        width={imageHeight}
        height={imageHeight}
        className="max-w-none object-contain object-center"
        style={{ height: imageHeight, width: "auto" }}
        priority
      />
    </span>
  )
}

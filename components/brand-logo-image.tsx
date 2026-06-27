import Image from "next/image"
import { brandLogo } from "@/lib/brand-assets"

/** Wordmark sits in the center of a large square PNG — light zoom + clip. */
const WORDMARK_SCALE = 3
const WIDTH_RATIO = 3.1

export function BrandLogoImage({
  height = 32,
  alt = "",
}: {
  height?: number
  alt?: string
}) {
  const imageHeight = Math.round(height * WORDMARK_SCALE)
  const width = Math.round(height * WIDTH_RATIO)

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden"
      style={{ height, width }}
    >
      <Image
        src={brandLogo}
        alt={alt}
        width={imageHeight}
        height={imageHeight}
        className="max-w-none object-contain"
        style={{ height: imageHeight, width: "auto" }}
        priority
      />
    </span>
  )
}

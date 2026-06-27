import Image from "next/image"
import { brandLogo } from "@/lib/brand-assets"

export function BrandLogoImage({
  height = 36,
  alt = "",
}: {
  height?: number
  alt?: string
  /** @deprecated ignored — logo uses natural aspect ratio */
  scale?: number
  /** @deprecated ignored — logo uses natural aspect ratio */
  widthRatio?: number
}) {
  const width = Math.round(height * (brandLogo.width / brandLogo.height))

  return (
    <Image
      src={brandLogo}
      alt={alt}
      width={width}
      height={height}
      className="h-auto w-auto shrink-0 object-contain"
      style={{ height, width: "auto", maxHeight: height }}
      priority
    />
  )
}

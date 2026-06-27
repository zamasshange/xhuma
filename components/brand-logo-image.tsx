import Image from "next/image"
import { brandLogo } from "@/lib/brand-assets"

export function BrandLogoImage({
  height = 40,
  alt = "Xhuma",
}: {
  height?: number
  alt?: string
  /** @deprecated ignored — logo uses natural aspect ratio */
  scale?: number
  /** @deprecated ignored — logo uses natural aspect ratio */
  widthRatio?: number
}) {
  const aspect = brandLogo.width / brandLogo.height
  const width = Math.round(height * aspect)

  return (
    <span className="inline-flex shrink-0 items-center" style={{ height, width }}>
      <Image
        src={brandLogo}
        alt={alt}
        width={width}
        height={height}
        className="size-full object-contain object-left"
        priority
      />
    </span>
  )
}

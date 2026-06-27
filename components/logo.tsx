import Link from "next/link"
import { BrandLogoImage } from "@/components/brand-logo-image"
import { SITE_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  href = "/",
  showText = false,
  height = 28,
  maxWidth = 120,
}: {
  className?: string
  href?: string
  showText?: boolean
  height?: number
  maxWidth?: number
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandLogoImage height={height} maxWidth={maxWidth} alt={SITE_NAME} />
      {showText && (
        <span className="font-heading text-lg font-semibold tracking-tight">{SITE_NAME}</span>
      )}
    </Link>
  )
}

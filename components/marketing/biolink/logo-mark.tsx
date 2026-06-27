import Link from "next/link"
import { BrandLogoImage } from "@/components/brand-logo-image"
import { cn } from "@/lib/utils"

export function LogoMark({
  className,
  href = "/",
  height = 28,
  maxWidth = 120,
  label = "Xhuma home",
}: {
  className?: string
  href?: string
  height?: number
  maxWidth?: number
  label?: string
}) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)} aria-label={label}>
      <BrandLogoImage height={height} maxWidth={maxWidth} />
    </Link>
  )
}

import Link from "next/link"
import { BrandLogoImage } from "@/components/brand-logo-image"
import { cn } from "@/lib/utils"

export function LogoMark({
  className,
  href = "/",
  height = 36,
  label = "Xhuma home",
}: {
  className?: string
  href?: string
  height?: number
  label?: string
}) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)} aria-label={label}>
      <BrandLogoImage height={height} />
    </Link>
  )
}

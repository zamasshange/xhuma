import { cn } from "@/lib/utils"

/** Theme mockup from CDN — show full phone frame without cropping */
export function ThemePreviewImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("block h-auto w-full object-contain", className)}
    />
  )
}

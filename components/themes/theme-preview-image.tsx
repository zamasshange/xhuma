import { cn } from "@/lib/utils"

/** Compact theme thumbnail for onboarding / picker grids */
export function ThemePreviewImage({
  src,
  alt,
  className,
  compact = false,
}: {
  src: string
  alt: string
  className?: string
  /** Crop to top of phone mockup — fits in small grid cells */
  compact?: boolean
}) {
  if (compact) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-xl bg-bio-grey-f4 ring-1 ring-black/5",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block h-28 w-full object-cover object-top sm:h-32"
        />
      </div>
    )
  }

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

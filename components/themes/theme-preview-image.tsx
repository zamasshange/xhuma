import { cn } from "@/lib/utils"

/** Theme thumbnail for pickers and galleries */
export function ThemePreviewImage({
  src,
  alt,
  className,
  compact = false,
  card = false,
}: {
  src: string
  alt: string
  className?: string
  /** Small grid cell in onboarding / editor */
  compact?: boolean
  /** Phone-aspect card for homepage gallery */
  card?: boolean
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
          className="block h-28 w-full object-cover object-center sm:h-32"
        />
      </div>
    )
  }

  if (card) {
    return (
      <div
        className={cn(
          "aspect-[9/16] overflow-hidden rounded-2xl bg-bio-grey-f4 ring-1 ring-black/5",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block size-full object-cover object-center"
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

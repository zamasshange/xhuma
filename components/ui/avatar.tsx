import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({
  src,
  alt,
  className,
  fallback,
}: {
  src?: string
  alt: string
  className?: string
  fallback?: string
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src || "/placeholder.svg"} alt={alt} className="size-full object-cover" />
      ) : (
        <span>{fallback ?? alt.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  )
}

export { Avatar }

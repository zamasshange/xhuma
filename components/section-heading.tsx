import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Badge variant="default" className="px-3 py-1">
          {eyebrow}
        </Badge>
      )}
      <h2 className="font-heading text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

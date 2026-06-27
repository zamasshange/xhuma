import { cn } from "@/lib/utils"

export function SectionBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-block rounded-full border border-bio-dark px-3 py-0.5 text-center text-base font-medium text-bio-dark max-sm:px-2 max-sm:text-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}

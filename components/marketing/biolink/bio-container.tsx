import { cn } from "@/lib/utils"

export function BioContainer({
  children,
  className,
  wide,
}: {
  children: React.ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 md:px-8 lg:px-10",
        wide ? "max-w-[1300px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </div>
  )
}

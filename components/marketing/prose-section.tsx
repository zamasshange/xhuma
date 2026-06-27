import { cn } from "@/lib/utils"

export function ProseSection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("border-t border-bio-dark/8 pt-8 first:border-t-0 first:pt-0", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-bio-dark sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-bio-grey">{children}</div>
    </section>
  )
}

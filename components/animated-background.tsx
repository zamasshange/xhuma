import { cn } from "@/lib/utils"

export function AnimatedBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="animate-float-slow absolute -left-24 -top-24 size-[28rem] rounded-full bg-brand/25 blur-[120px]" />
      <div className="animate-float-slow-2 absolute -right-32 top-1/3 size-[32rem] rounded-full bg-[var(--brand-2)]/20 blur-[140px]" />
      <div className="animate-float-slow absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-brand/15 blur-[120px]" />
    </div>
  )
}

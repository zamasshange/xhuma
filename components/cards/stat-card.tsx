import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { Card } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  change,
  icon,
  className,
}: {
  label: string
  value: string
  change?: number
  icon: string
  className?: string
}) {
  const positive = change !== undefined && change >= 0
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
          {change !== undefined && (
            <p className={cn("mt-1 text-xs font-medium", positive ? "text-emerald-500" : "text-destructive")}>
              {positive ? "+" : ""}
              {change}% vs last week
            </p>
          )}
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon name={icon} className="size-5" />
        </div>
      </div>
    </Card>
  )
}

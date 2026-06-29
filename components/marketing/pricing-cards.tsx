"use client"

import Link from "next/link"
import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { pricingPlans } from "@/data/marketing"
import { useRegion } from "@/components/providers/region-provider"
import { cn } from "@/lib/utils"

export function PricingCards() {
  const { formatCurrency } = useRegion()
  const [annual, setAnnual] = useState(true)

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
        <span className={cn("text-sm font-medium", !annual && "text-foreground", annual && "text-muted-foreground")}>
          Monthly
        </span>
        <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
        <span className={cn("text-sm font-medium", annual ? "text-foreground" : "text-muted-foreground")}>
          Annual
        </span>
        <Badge variant="success" className="ml-1">Save 20%</Badge>
      </div>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan, i) => {
          const price = plan.price === 0 ? 0 : annual ? Math.round(plan.price * 0.8) : plan.price
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
                plan.highlighted
                  ? "border-brand/60 shadow-lg ring-1 ring-brand/30"
                  : "border-border",
              )}
            >
              {plan.highlighted && (
                <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  {formatCurrency(price)}
                </span>
                {price > 0 && <span className="mb-1 text-sm text-muted-foreground">/mo</span>}
              </div>
              <Button
                render={<Link href="/editor" />}
                className={cn(
                  "mt-5 h-11 min-h-11 w-full text-base",
                  plan.highlighted
                    ? "bg-brand-gradient text-brand-foreground"
                    : "",
                )}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Check className="size-3" />
                    </span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

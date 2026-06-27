"use client"

import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { BioCard, BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { getAiCache, setAiCache } from "@/lib/ai/cache"

type Props = {
  analytics: {
    profileViews: number
    linkClicks: number
    topLinks: { title: string; clicks: number }[]
  } | null
}

export function AiAnalyticsInsights({ analytics }: Props) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!analytics) return
    const cacheKey = `insights-${analytics.profileViews}-${analytics.linkClicks}-${analytics.topLinks.map((l) => l.title).join(",")}`
    const cached = getAiCache<string[]>(cacheKey)
    if (cached) {
      setInsights(cached)
      return
    }

    setLoading(true)
    apiFetch<{ insights: string[] }>("/api/ai/insights", {
      method: "POST",
      body: JSON.stringify({ analytics }),
    }).then((res) => {
      setLoading(false)
      if (res.success && res.data) {
        setInsights(res.data.insights)
        setAiCache(cacheKey, res.data.insights)
      }
    })
  }, [analytics])

  if (!analytics) return null

  return (
    <BioCard className="border-dashed border-bio-dark/15 bg-gradient-to-br from-white to-bio-grey-f4/30">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-bio-dark" />
        <h3 className="font-semibold text-bio-dark">AI Insights</h3>
      </div>
      <BioMuted className="mt-1 text-xs">What your numbers mean — in plain language.</BioMuted>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-bio-grey">
          <Loader2 className="size-4 animate-spin" /> Analysing your stats…
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {insights.map((line, i) => (
            <li key={i} className="rounded-xl bg-white px-3 py-2.5 text-sm leading-relaxed text-bio-dark">
              {line}
            </li>
          ))}
        </ul>
      )}
    </BioCard>
  )
}

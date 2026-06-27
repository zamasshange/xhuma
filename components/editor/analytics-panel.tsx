"use client"

import { useEffect, useState } from "react"
import { BioCard, BioMuted, BioSectionTitle } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { formatNumber } from "@/lib/locale"

type AnalyticsData = {
  profileViews: number
  linkClicks: number
  totalLinkClicksCounter: number
  topLinks: { id: string; title: string; clicks: number }[]
  recentViews: number
  recentClicks: number
}

function BioStat({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string
  value: string
  change: string
  icon: LucideIcon
}) {
  return (
    <BioCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-bio-grey">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-bio-dark">{value}</p>
          <p className="mt-1 text-xs font-medium text-bio-grey">{change}</p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bio-dark/5 text-bio-dark">
          <Icon className="size-5" />
        </div>
      </div>
    </BioCard>
  )
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<AnalyticsData>("/api/analytics").then((res) => {
      if (res.success && res.data) setData(res.data)
      else setError(res.error ?? "Could not load analytics")
    })
  }, [])

  if (error) return <p className="text-sm text-bio-red">{error}</p>
  if (!data) return <BioMuted>Loading analytics…</BioMuted>

  const stats = [
    { id: "views", label: "Profile views", value: formatNumber(data.profileViews), change: `+${formatNumber(data.recentViews)} this week`, icon: Eye },
    { id: "clicks", label: "Link clicks", value: formatNumber(data.linkClicks), change: `+${formatNumber(data.recentClicks)} this week`, icon: MousePointerClick },
    { id: "total", label: "Total on links", value: formatNumber(data.totalLinkClicksCounter), change: "All time", icon: TrendingUp },
    { id: "links", label: "Active links", value: String(data.topLinks.length), change: "Tracked", icon: Link2 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <BioSectionTitle>Analytics</BioSectionTitle>
        <BioMuted className="mt-1">Track views and link clicks on your page.</BioMuted>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <BioStat key={stat.id} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} />
        ))}
      </div>

      <BioCard>
        <h3 className="font-semibold text-bio-dark">Top links</h3>
        <div className="mt-4 overflow-x-auto">
          {data.topLinks.length === 0 ? (
            <BioMuted>No links yet. Add links on the My page tab to start tracking.</BioMuted>
          ) : (
            <table className="w-full min-w-[300px] text-sm">
              <thead>
                <tr className="border-b border-bio-dark/10 text-left text-bio-grey">
                  <th className="pb-3 font-medium">Link</th>
                  <th className="pb-3 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.topLinks.map((link) => (
                  <tr key={link.id} className="border-b border-bio-dark/8 last:border-0">
                    <td className="py-3 pr-4 text-bio-dark">{link.title}</td>
                    <td className="py-3 text-bio-dark">{formatNumber(link.clicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </BioCard>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/cards/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api-fetch"
import { Eye, MousePointerClick, TrendingUp, Link2 } from "lucide-react"

type AnalyticsData = {
  profileViews: number
  linkClicks: number
  totalLinkClicksCounter: number
  topLinks: { id: string; title: string; clicks: number }[]
  recentViews: number
  recentClicks: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    apiFetch<AnalyticsData>("/api/analytics").then((res) => {
      if (res.success && res.data) setData(res.data)
    })
  }, [])

  if (!data) return <p className="text-muted-foreground">Loading analytics…</p>

  const stats = [
    { id: "views", label: "Profile views", value: data.profileViews.toLocaleString(), change: `+${data.recentViews} this week`, icon: Eye },
    { id: "clicks", label: "Link clicks", value: data.linkClicks.toLocaleString(), change: `+${data.recentClicks} this week`, icon: MousePointerClick },
    { id: "total", label: "Total on links", value: data.totalLinkClicksCounter.toLocaleString(), change: "All time", icon: TrendingUp },
    { id: "links", label: "Active links", value: String(data.topLinks.length), change: "Tracked", icon: Link2 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Track views and link clicks.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top links</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.topLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet. Add links to start tracking clicks.</p>
          ) : (
            <table className="w-full min-w-[300px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Link</th>
                  <th className="pb-3 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.topLinks.map((link) => (
                  <tr key={link.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4">{link.title}</td>
                    <td className="py-3">{link.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

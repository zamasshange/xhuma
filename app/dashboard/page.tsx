"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Sparkles, Eye, MousePointerClick } from "lucide-react"
import { StatCard } from "@/components/cards/stat-card"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api-fetch"

export default function DashboardPage() {
  const { profile } = useDashboard()
  const [stats, setStats] = useState({ profileViews: 0, linkClicks: 0, recentViews: 0, recentClicks: 0 })

  useEffect(() => {
    apiFetch<typeof stats>("/api/analytics").then((res) => {
      if (res.success && res.data) setStats(res.data)
    })
  }, [])

  const overview = [
    { id: "views", label: "Profile views", value: stats.profileViews.toLocaleString(), change: `+${stats.recentViews} this week`, icon: Eye },
    { id: "clicks", label: "Link clicks", value: stats.linkClicks.toLocaleString(), change: `+${stats.recentClicks} this week`, icon: MousePointerClick },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Welcome back{profile ? `, ${profile.display_name}` : ""}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/dashboard/links" />} variant="outline" className="h-11 flex-1 sm:flex-none">
            <Plus className="size-4" />
            Add link
          </Button>
          <Button render={<Link href="/dashboard/ai-studio" />} className="h-11 flex-1 bg-brand-gradient text-brand-foreground sm:flex-none">
            <Sparkles className="size-4" />
            AI Studio
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {overview.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/dashboard/profile", label: "Edit profile", desc: "Update bio & avatar" },
            { href: "/dashboard/appearance", label: "Customize theme", desc: "Colors & button style" },
            { href: "/dashboard/analytics", label: "View analytics", desc: "Views & clicks" },
            { href: profile ? `/${profile.username}` : "/dashboard/profile", label: "Preview page", desc: "See your live profile" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted"
            >
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

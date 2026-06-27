import type { ReactNode } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Creator Dashboard",
  description:
    "Manage your Xhuma link in bio page, analytics, AI tools, and settings from your creator dashboard.",
  path: "/dashboard",
  noIndex: true,
})

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </div>
  )
}

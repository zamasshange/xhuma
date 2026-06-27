import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </div>
  )
}

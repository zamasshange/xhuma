import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  )
}

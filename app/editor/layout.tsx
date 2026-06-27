import type { ReactNode } from "react"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <DashboardProvider>{children}</DashboardProvider>
    </div>
  )
}

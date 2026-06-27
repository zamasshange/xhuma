import type { ReactNode } from "react"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"

/** Minimal layout — bio.link editor has its own chrome, no sidebar. */
export default function EditorLayout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>
}

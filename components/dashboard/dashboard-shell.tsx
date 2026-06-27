"use client"

import { useState, type ReactNode } from "react"
import { DashboardBottomNav, DashboardHeader, DashboardSidebar } from "@/components/dashboard/shell"

export function DashboardShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenuOpen={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-x-hidden pb-20 lg:pb-6">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">{children}</div>
        </main>
        <DashboardBottomNav />
      </div>
    </div>
  )
}

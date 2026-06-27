"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Logo } from "@/components/logo"
import { ThemeSwitch } from "@/components/theme-switch"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { dashboardNav, mobileBottomNav } from "@/constants/navigation"
import { cn } from "@/lib/utils"

export function DashboardHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { profile } = useDashboard()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuOpen} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
        <div className="lg:hidden">
          <Logo />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        {profile && (
          <Link
            href={`/${profile.username}`}
            className="flex items-center gap-2 rounded-xl border border-border px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <Avatar src={profile.avatar_url ?? undefined} alt={profile.display_name} className="size-7" />
            <span className="hidden text-sm font-medium sm:inline">{profile.display_name}</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export function DashboardSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { profile } = useDashboard()

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {dashboardNav.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-card/30 lg:flex">
        <div className="flex h-14 items-center border-b border-border/60 px-5">
          <Logo />
        </div>
        {nav}
        {profile && (
          <div className="mt-auto border-t border-border/60 p-4">
            <Link
              href={`/${profile.username}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted"
            >
              <Avatar src={profile.avatar_url ?? undefined} alt={profile.display_name} className="size-9" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">xhuma.io/{profile.username}</p>
              </div>
            </Link>
          </div>
        )}
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-card shadow-xl"
            >
              <div className="flex h-14 items-center border-b border-border px-5">
                <Logo />
              </div>
              {nav}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function DashboardBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {mobileBottomNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[56px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-brand" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("size-5", active && "text-brand")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

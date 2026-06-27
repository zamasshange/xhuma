"use client"

import Link from "next/link"
import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { cn } from "@/lib/utils"
import { SITE_DOMAIN } from "@/lib/brand"

const TABS = [
  { id: "page", label: "My page" },
  { id: "analytics", label: "Stats" },
  { id: "ai", label: "AI" },
  { id: "settings", label: "Settings" },
] as const

export type EditorTabId = (typeof TABS)[number]["id"]

export function EditorShell({
  tab,
  onTabChange,
  username,
  actions,
  children,
}: {
  tab: EditorTabId
  onTabChange: (tab: EditorTabId) => void
  username?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f7f8] text-bio-dark">
      <div className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto max-w-[1300px]">
          {/* Floating pill — matches marketing navbar */}
          <div className="rounded-[32px] bg-white px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:rounded-[40px] sm:px-6 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <LogoMark height={32} className="shrink-0" />

              {username && (
                <div className="hidden min-w-0 flex-1 justify-center sm:flex">
                  <span className="truncate rounded-full bg-bio-grey-f4 px-4 py-1.5 text-sm font-medium text-bio-grey">
                    {SITE_DOMAIN}/{username}
                  </span>
                </div>
              )}

              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>

            <nav className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-bio-dark/6 pt-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5",
                    tab === t.id
                      ? "bg-bio-dark text-white"
                      : "text-bio-grey hover:bg-bio-grey-f4 hover:text-bio-dark",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1300px] flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  )
}

export function EditorPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(13,12,34,0.06)] sm:p-6", className)}>
      {children}
    </div>
  )
}

export function EditorSectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-bio-dark sm:text-xl">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-bio-grey">{subtitle}</p>}
    </div>
  )
}

export function EditorPreviewFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <PhoneDeviceFrame size="lg" className={className}>
      {children}
    </PhoneDeviceFrame>
  )
}

export function EditorHomeLink() {
  return (
    <Link
      href="/"
      className="rounded-full px-3 py-2 text-sm font-semibold text-bio-grey transition-colors hover:bg-bio-grey-f4 hover:text-bio-dark sm:px-4"
    >
      Home
    </Link>
  )
}

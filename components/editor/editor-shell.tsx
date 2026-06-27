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
    <div className="xhuma-site flex min-h-dvh flex-col overflow-x-hidden bg-[#f7f7f8] text-bio-dark">
      <div className="sticky top-0 z-50 border-b border-bio-dark/6 bg-white/95 px-3 py-2.5 backdrop-blur-sm sm:px-6 sm:py-3">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <LogoMark height={26} maxWidth={108} className="shrink-0" />

            {username ? (
              <div className="min-w-0 flex-1 sm:flex sm:justify-center">
                <span className="block truncate rounded-lg bg-bio-grey-f4 px-2 py-1 text-[11px] font-medium text-bio-grey sm:px-3 sm:py-1.5 sm:text-sm">
                  {SITE_DOMAIN}/{username}
                </span>
              </div>
            ) : (
              <div className="flex-1 sm:hidden" />
            )}

            <div className="flex max-w-[min(52vw,220px)] shrink-0 items-center gap-1 overflow-x-auto no-scrollbar sm:max-w-none sm:gap-2">
              {actions}
            </div>
          </div>

          <nav className="mt-2 flex gap-1 overflow-x-auto pb-0.5 no-scrollbar sm:mt-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors min-h-11 sm:px-4",
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

      <main className="mx-auto w-full max-w-[1300px] flex-1 overflow-x-hidden px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export function EditorPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-bio-dark/6 bg-white p-5 shadow-[0_2px_16px_rgba(13,12,34,0.04)] sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function EditorSectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-bio-dark sm:text-xl">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-bio-grey">{subtitle}</p>}
    </div>
  )
}

export function EditorPreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-full justify-center overflow-hidden px-1">
      <PhoneDeviceFrame size="preview" showLabel={false} glow={false} className="w-full max-w-full">
        {children}
      </PhoneDeviceFrame>
    </div>
  )
}

export function EditorHomeLink() {
  return (
    <Link
      href="/"
      className="rounded-lg px-3 py-2 text-sm font-semibold text-bio-grey transition-colors hover:bg-bio-grey-f4 hover:text-bio-dark sm:px-4"
    >
      Home
    </Link>
  )
}

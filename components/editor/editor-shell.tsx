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
    <div className="flex min-h-dvh flex-col bg-[linear-gradient(165deg,#f7f7f8_0%,#eef2ff_40%,#fdf2f8_100%)] text-bio-dark">
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

export function EditorPanel({
  children,
  className,
  accent,
}: {
  children: React.ReactNode
  className?: string
  accent?: "purple" | "pink" | "sky" | "amber" | "mint"
}) {
  const accentStyles = {
    purple:
      "border border-violet-200/60 bg-gradient-to-br from-violet-50/90 via-white to-fuchsia-50/50 shadow-[0_8px_32px_rgba(124,58,237,0.1)]",
    pink: "border border-pink-200/60 bg-gradient-to-br from-pink-50/90 via-white to-rose-50/50 shadow-[0_8px_32px_rgba(236,72,153,0.1)]",
    sky: "border border-sky-200/60 bg-gradient-to-br from-sky-50/90 via-white to-cyan-50/50 shadow-[0_8px_32px_rgba(14,165,233,0.1)]",
    amber:
      "border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 shadow-[0_8px_32px_rgba(245,158,11,0.1)]",
    mint: "border border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 shadow-[0_8px_32px_rgba(16,185,129,0.1)]",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-5 sm:p-6",
        accent ? accentStyles[accent] : "bg-white shadow-[0_4px_24px_rgba(13,12,34,0.07)]",
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
  icon,
}: {
  children: React.ReactNode
  subtitle?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
            {icon}
          </span>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-bio-dark sm:text-xl">{children}</h2>
      </div>
      {subtitle && <p className={cn("mt-1.5 text-sm text-bio-grey", icon && "ml-[46px]")}>{subtitle}</p>}
    </div>
  )
}

export function EditorPreviewFrame({
  children,
  className,
  label = "Live preview",
}: {
  children: React.ReactNode
  className?: string
  label?: string
}) {
  return (
    <div className={className}>
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500/80">
        {label}
      </p>
      <PhoneDeviceFrame size="lg">{children}</PhoneDeviceFrame>
    </div>
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

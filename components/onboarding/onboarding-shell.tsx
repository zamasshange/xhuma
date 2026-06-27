"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { cn } from "@/lib/utils"

export function OnboardingProgress({
  step,
  total,
  onBack,
  showBack = true,
}: {
  step: number
  total: number
  onBack?: () => void
  showBack?: boolean
}) {
  const pct = Math.round((step / total) * 100)

  return (
    <div className="flex items-center gap-4">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-bio-dark transition-colors hover:bg-bio-grey-f4"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
      ) : (
        <Link
          href="/"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-bio-dark transition-colors hover:bg-bio-grey-f4"
          aria-label="Home"
        >
          <ArrowLeft className="size-5" />
        </Link>
      )}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-bio-grey-d9">
        <div
          className="h-full rounded-full bg-bio-dark transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function OnboardingShell({
  step,
  totalSteps,
  onBack,
  children,
  footer,
  className,
  contentClassName,
}: {
  step: number
  totalSteps: number
  onBack?: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  /** e.g. overflow-hidden for preview step so footer stays on screen */
  contentClassName?: string
}) {
  return (
    <div className="xhuma-site flex h-dvh flex-col overflow-hidden bg-[#f7f7f8] text-bio-dark">
      <header className="shrink-0 border-b border-bio-dark/8 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <LogoMark height={28} maxWidth={118} />
        </div>
      </header>

      <main
        className={cn(
          "mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-5",
          className,
        )}
      >
        <div className="shrink-0">
          <OnboardingProgress step={step} total={totalSteps} onBack={onBack} />
        </div>

        <div
          className={cn(
            "mt-4 flex min-h-0 flex-1 flex-col",
            contentClassName ?? "overflow-y-auto",
          )}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-bio-dark/8 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pt-4">
            {footer}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export function OnboardingTitle({
  children,
  subtitle,
  className,
  compact,
}: {
  children: React.ReactNode
  subtitle?: string
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn(compact ? "mb-2 shrink-0" : "mb-6", className)}>
      <h1
        className={cn(
          "font-semibold tracking-tight text-bio-dark",
          compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
        )}
      >
        {children}
      </h1>
      {subtitle && <p className="mt-2 text-base text-bio-grey">{subtitle}</p>}
    </div>
  )
}

export function ContinueButton({
  children = "Continue",
  disabled,
  onClick,
  type = "button",
}: {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="bio-dark-btn w-full rounded-xl bg-bio-dark py-3.5 text-base font-semibold text-white transition-colors hover:bg-bio-dark/90 disabled:opacity-50 sm:py-4"
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function PlatformOption({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  selected?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl bg-bio-grey-f4 px-5 py-4 text-left text-base font-medium text-bio-dark transition-all hover:bg-white",
        selected && "bg-white ring-2 ring-bio-dark ring-offset-2 shadow-md",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">{icon}</span>
      <span className="flex-1 text-center">{label}</span>
      {selected && (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bio-dark text-white">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
            <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {!selected && <span className="size-6 shrink-0" />}
    </button>
  )
}

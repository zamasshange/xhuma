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
  className,
}: {
  step: number
  totalSteps: number
  onBack?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="xhuma-site flex min-h-dvh flex-col bg-[#f7f7f8] text-bio-dark">
      <header className="border-b border-bio-dark/8 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <LogoMark height={28} />
        </div>
      </header>

      <main className={cn("mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6", className)}>
        <OnboardingProgress step={step} total={totalSteps} onBack={onBack} />
        <div className="mt-8 flex flex-1 flex-col">{children}</div>
      </main>
    </div>
  )
}

export function OnboardingTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-bio-dark sm:text-3xl">{children}</h1>
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
      className="bio-continue-btn mt-auto w-full rounded-2xl py-4 text-base font-semibold text-white transition-opacity disabled:opacity-50"
    >
      {children}
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
        "flex w-full items-center gap-4 rounded-2xl bg-bio-grey-f4 px-5 py-4 text-left text-base font-medium text-bio-dark transition-all",
        selected && "ring-2 ring-bio-dark ring-offset-2",
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

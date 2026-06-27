"use client"

import { cn } from "@/lib/utils"

const SIZES = {
  sm: {
    width: "w-[168px]",
    bezel: "p-[7px] rounded-[2rem]",
    screen: "rounded-[1.55rem]",
    island: "top-2 h-[18px] w-[72px]",
    indicator: "h-[3px] w-[72px] mb-1.5",
    maxH: "max-h-[300px]",
  },
  md: {
    width: "w-[260px] sm:w-[280px]",
    bezel: "p-[10px] rounded-[2.75rem]",
    screen: "rounded-[2.15rem]",
    island: "top-2.5 h-[22px] w-[88px]",
    indicator: "h-[4px] w-[96px] mb-2",
    maxH: "max-h-[520px]",
  },
  lg: {
    width: "w-[300px] sm:w-[320px]",
    bezel: "p-[11px] rounded-[3rem]",
    screen: "rounded-[2.35rem]",
    island: "top-3 h-[24px] w-[96px]",
    indicator: "h-[4px] w-[104px] mb-2.5",
    maxH: "max-h-[580px]",
  },
} as const

export type PhoneDeviceSize = keyof typeof SIZES

export function PhoneDeviceFrame({
  children,
  className,
  size = "md",
  label,
  showLabel = true,
}: {
  children: React.ReactNode
  className?: string
  size?: PhoneDeviceSize
  label?: string
  showLabel?: boolean
}) {
  const s = SIZES[size]

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {showLabel && (
        <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-bio-grey sm:text-xs">
          {label ?? "Live preview"}
        </p>
      )}

      <div
        className={cn(
          "phone-device relative mx-auto shadow-[0_40px_80px_-20px_rgba(13,12,34,0.35)]",
          s.width,
        )}
      >
        {/* Bezel */}
        <div
          className={cn(
            "relative bg-gradient-to-b from-[#3a3a3c] via-[#1c1c1e] to-[#0a0a0a]",
            s.bezel,
          )}
        >
          {/* Side buttons — subtle */}
          <div className="pointer-events-none absolute -left-[2px] top-[88px] h-8 w-[3px] rounded-l bg-[#2a2a2c]" aria-hidden />
          <div className="pointer-events-none absolute -left-[2px] top-[132px] h-14 w-[3px] rounded-l bg-[#2a2a2c]" aria-hidden />
          <div className="pointer-events-none absolute -right-[2px] top-[108px] h-20 w-[3px] rounded-r bg-[#2a2a2c]" aria-hidden />

          {/* Screen */}
          <div className={cn("relative overflow-hidden bg-black", s.screen)}>
            {/* Dynamic Island */}
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                s.island,
              )}
              aria-hidden
            />

            {/* Scrollable content */}
            <div
              className={cn(
                "phone-device-screen overflow-x-hidden overflow-y-auto no-scrollbar",
                s.maxH,
              )}
            >
              {children}
            </div>

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex justify-center bg-gradient-to-t from-black/40 to-transparent pt-6 pb-1">
              <div className={cn("rounded-full bg-white/30", s.indicator)} aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

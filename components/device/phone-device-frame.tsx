"use client"

import { cn } from "@/lib/utils"

const SIZES = {
  thumb: {
    width: "w-full max-w-[118px]",
    bezel: "p-[3px] rounded-[1.2rem]",
    screen: "rounded-[0.95rem]",
    island: "top-[4px] h-[9px] w-[38px]",
    islandCam: "size-[3px]",
    indicator: "h-[2px] w-[36px]",
    maxH: "h-[192px]",
    sideBtn: { left: "top-[34px] h-4", leftLow: "top-[52px] h-5", right: "top-[42px] h-7" },
  },
  sm: {
    width: "w-[200px]",
    bezel: "p-[5px] rounded-[1.85rem]",
    screen: "rounded-[1.45rem]",
    island: "top-[7px] h-[17px] w-[68px]",
    islandCam: "size-[5px]",
    indicator: "h-[3px] w-[68px]",
    maxH: "h-[400px]",
    sideBtn: { left: "top-[72px] h-7", leftLow: "top-[108px] h-11", right: "top-[92px] h-16" },
  },
  card: {
    width: "w-full max-w-[200px] sm:max-w-[228px]",
    bezel: "p-[6px] rounded-[2.1rem]",
    screen: "rounded-[1.7rem]",
    island: "top-[8px] h-[18px] w-[72px]",
    islandCam: "size-[5px]",
    indicator: "h-[3px] w-[76px]",
    maxH: "h-[492px]",
    sideBtn: { left: "top-[80px] h-7", leftLow: "top-[120px] h-11", right: "top-[100px] h-14" },
  },
  md: {
    width: "w-[268px] sm:w-[290px]",
    bezel: "p-[7px] rounded-[2.65rem]",
    screen: "rounded-[2.1rem]",
    island: "top-[9px] h-[21px] w-[84px]",
    islandCam: "size-[6px]",
    indicator: "h-[4px] w-[92px]",
    maxH: "h-[560px]",
    sideBtn: { left: "top-[100px] h-8", leftLow: "top-[148px] h-14", right: "top-[124px] h-[72px]" },
  },
  editor: {
    width: "w-full max-w-[min(100%,280px)] sm:max-w-[300px]",
    bezel: "p-[7px] rounded-[2.65rem]",
    screen: "rounded-[2.15rem]",
    island: "top-[9px] h-[21px] w-[84px]",
    islandCam: "size-[6px]",
    indicator: "h-[4px] w-[92px]",
    maxH: "h-[640px] sm:h-[660px]",
    sideBtn: { left: "top-[100px] h-8", leftLow: "top-[148px] h-14", right: "top-[124px] h-[72px]" },
  },
  preview: {
    width: "w-full max-w-[min(100%,280px)] sm:max-w-[300px]",
    bezel: "p-[7px] rounded-[2.65rem]",
    screen: "rounded-[2.15rem]",
    island: "top-[9px] h-[21px] w-[84px]",
    islandCam: "size-[6px]",
    indicator: "h-[4px] w-[92px]",
    maxH: "h-[640px] sm:h-[660px]",
    sideBtn: { left: "top-[100px] h-8", leftLow: "top-[148px] h-14", right: "top-[124px] h-[72px]" },
  },
  lg: {
    width: "w-[300px] sm:w-[318px]",
    bezel: "p-[8px] rounded-[2.85rem]",
    screen: "rounded-[2.25rem]",
    island: "top-[10px] h-[23px] w-[92px]",
    islandCam: "size-[7px]",
    indicator: "h-[4px] w-[100px]",
    maxH: "h-[680px]",
    sideBtn: { left: "top-[108px] h-9", leftLow: "top-[160px] h-[60px]", right: "top-[132px] h-20" },
  },
} as const

export type PhoneDeviceSize = keyof typeof SIZES

export function PhoneDeviceFrame({
  children,
  className,
  size = "md",
  label,
  showLabel = true,
  glow = true,
}: {
  children: React.ReactNode
  className?: string
  size?: PhoneDeviceSize
  label?: string
  /** Soft pink–purple halo behind the device */
  glow?: boolean
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

      <div className={cn("relative mx-auto max-w-full", s.width, glow && "phone-device-stage py-4 sm:py-6")}>
        {glow && <div className="phone-device-aura" aria-hidden />}

        <div className="phone-device relative z-10">
          {/* Titanium bezel */}
          <div className={cn("phone-device-bezel relative", s.bezel)}>
            {/* Side buttons */}
            <div
              className={cn(
                "phone-device-btn pointer-events-none absolute -left-[1.5px] w-[2.5px] rounded-l-sm",
                s.sideBtn.left,
              )}
              aria-hidden
            />
            <div
              className={cn(
                "phone-device-btn pointer-events-none absolute -left-[1.5px] w-[2.5px] rounded-l-sm",
                s.sideBtn.leftLow,
              )}
              aria-hidden
            />
            <div
              className={cn(
                "phone-device-btn pointer-events-none absolute -right-[1.5px] w-[2.5px] rounded-r-sm",
                s.sideBtn.right,
              )}
              aria-hidden
            />

            {/* Screen */}
            <div className={cn("phone-device-screen relative overflow-hidden bg-black", s.screen)}>
              {/* Dynamic Island */}
              <div
                className={cn(
                  "phone-device-island pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 items-center justify-end rounded-full px-2",
                  s.island,
                )}
                aria-hidden
              >
                <span className={cn("rounded-full bg-[#0a0a12] ring-1 ring-white/10", s.islandCam)} />
              </div>

              {/* Scrollable content */}
              <div
                className={cn(
                  "phone-device-screen-inner overflow-x-hidden overflow-y-auto overscroll-contain no-scrollbar",
                  s.maxH,
                )}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {children}
              </div>

              {/* Glass edge reflection */}
              <div
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/[0.07] via-transparent to-black/20"
                aria-hidden
              />

              {/* Home indicator */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-[5px] pt-8"
                aria-hidden
              >
                <div className={cn("rounded-full bg-white/35", s.indicator)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

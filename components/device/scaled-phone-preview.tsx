"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { cn } from "@/lib/utils"

/** iPhone 14 logical viewport — industry-standard mobile width */
export const DEVICE_VIEWPORT_W = 390
export const DEVICE_VIEWPORT_H = 844

/** Full frame including bezel (7px padding each side) */
export const DEVICE_FRAME_W = DEVICE_VIEWPORT_W + 14
export const DEVICE_FRAME_H = DEVICE_VIEWPORT_H + 14

/**
 * Renders a real-size phone preview, then scales it down to fit the container
 * so the entire template layout is visible (not cropped/zoomed).
 */
export function ScaledPhonePreview({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.38)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      setScale(Math.min(w / DEVICE_FRAME_W, h / DEVICE_FRAME_H))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-0"
        style={{
          width: DEVICE_FRAME_W,
          height: DEVICE_FRAME_H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <PhoneDeviceFrame size="native" showLabel={false} glow={false} clipContent>
          {children}
        </PhoneDeviceFrame>
      </div>
    </div>
  )
}

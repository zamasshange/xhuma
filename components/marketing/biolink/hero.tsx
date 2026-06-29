"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion"
import { bioHero } from "@/data/bio-link"
import { ClaimLinkInput } from "@/components/marketing/biolink/claim-link"
import { HERO_MOCKUPS } from "@/lib/hero-images"
import { useRegion } from "@/components/providers/region-provider"
import { getHeroMockupAlts } from "@/lib/region/content"
import { cn } from "@/lib/utils"

const ROTATE_MS = 5500
const SWIPE_THRESHOLD = 48

export function BiolinkHero() {
  const { code: region } = useRegion()
  const alts = getHeroMockupAlts(region)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const active = HERO_MOCKUPS[activeIndex]

  const goTo = useCallback((index: number) => {
    setActiveIndex((current) => {
      if (index === current) return current
      setDirection(index > current ? 1 : -1)
      setProgressKey((k) => k + 1)
      return index
    })
  }, [])

  const goNext = useCallback(() => {
    setDirection(1)
    setProgressKey((k) => k + 1)
    setActiveIndex((i) => (i + 1) % HERO_MOCKUPS.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setProgressKey((k) => k + 1)
    setActiveIndex((i) => (i - 1 + HERO_MOCKUPS.length) % HERO_MOCKUPS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(goNext, ROTATE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, goNext])

  const dragX = useMotionValue(0)

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext()
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev()
  }

  return (
    <section className="relative overflow-hidden">
      <div className="bio-fade-up mx-auto flex w-[min(1200px,92%)] flex-col pt-28 max-lg:pt-24 lg:flex-row">
        <div className="w-full text-bio-dark lg:w-3/5 lg:pl-10 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center">
          <h1 className="mt-6 whitespace-pre-line text-4xl font-bold leading-[1.08] tracking-tighter sm:text-5xl lg:text-7xl">
            {bioHero.title}
          </h1>
          <h4 className="mt-5 w-full text-base font-normal leading-relaxed sm:mt-6 sm:text-lg lg:mt-6 lg:w-4/5 lg:text-xl">
            {bioHero.subtitle}
          </h4>
          <ClaimLinkInput className="mt-6 w-full max-w-[470px] sm:mt-8" />
        </div>

        <div
          className="mt-10 flex w-full items-center justify-center pb-6 sm:mt-12 lg:mt-0 lg:w-2/5 lg:pb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div
            className="relative flex w-full max-w-[min(340px,88vw)] flex-col items-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full blur-3xl"
              aria-hidden
              animate={{
                opacity: [0.55, 0.85, 0.55],
                scale: [0.88, 0.94, 0.88],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255, 88, 120, 0.35), rgba(168, 85, 247, 0.28), transparent 70%)",
              }}
            />

            <div
              className="relative aspect-[9/19] w-full min-h-[320px] max-h-[min(65vh,560px)] sm:min-h-[380px] sm:max-h-[min(72vh,640px)]"
              style={{ perspective: 1200 }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  style={{ x: dragX }}
                  onDragEnd={onDragEnd}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir * 72,
                      opacity: 0,
                      scale: 0.92,
                      rotateY: dir * -12,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                    },
                    exit: (dir: number) => ({
                      x: dir * -72,
                      opacity: 0,
                      scale: 0.94,
                      rotateY: dir * 12,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <Image
                    src={active.src}
                    alt={alts[activeIndex] ?? active.alt}
                    fill
                    priority={activeIndex === 0}
                    sizes="(max-width: 640px) 85vw, 380px"
                    className="pointer-events-none object-contain object-center drop-shadow-[0_28px_56px_rgba(13,12,34,0.22)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              {HERO_MOCKUPS.map((mockup, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={mockup.id}
                    type="button"
                    aria-label={`Show mockup ${i + 1}`}
                    aria-current={isActive}
                    onClick={() => goTo(i)}
                    className="relative flex min-h-11 min-w-11 items-center justify-center p-2"
                  >
                    <span
                      className={cn(
                        "relative block h-2 overflow-hidden rounded-full bg-bio-dark/20 transition-all duration-300",
                        isActive ? "w-7" : "w-2",
                      )}
                    >
                      {isActive && !paused && (
                        <motion.span
                          key={progressKey}
                          className="absolute inset-y-0 left-0 rounded-full bg-bio-dark"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                        />
                      )}
                      {isActive && paused && (
                        <span className="absolute inset-0 rounded-full bg-bio-dark" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

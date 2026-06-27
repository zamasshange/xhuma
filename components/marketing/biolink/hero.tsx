"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { bioHero } from "@/data/bio-link"
import { ClaimLinkInput } from "@/components/marketing/biolink/claim-link"
import { HERO_MOCKUPS } from "@/lib/hero-images"

const ROTATE_MS = 5000

export function BiolinkHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = HERO_MOCKUPS[activeIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_MOCKUPS.length)
    }, ROTATE_MS)
    return () => clearInterval(interval)
  }, [])

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

        <div className="mt-10 flex w-full items-center justify-center pb-6 sm:mt-12 lg:mt-0 lg:w-2/5 lg:pb-10">
          <div className="relative flex w-full max-w-[min(340px,88vw)] flex-col items-center">
            {/* Soft glow behind mockups */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255, 88, 120, 0.35), rgba(168, 85, 247, 0.28), transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative aspect-[9/19] w-full min-h-[320px] max-h-[min(65vh,560px)] sm:min-h-[380px] sm:max-h-[min(72vh,640px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.src}
                    alt={active.alt}
                    fill
                    priority={activeIndex === 0}
                    sizes="(max-width: 640px) 85vw, 380px"
                    className="object-contain object-center drop-shadow-[0_24px_48px_rgba(13,12,34,0.18)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex gap-2">
              {HERO_MOCKUPS.map((mockup, i) => (
                <button
                  key={mockup.id}
                  type="button"
                  aria-label={`Show mockup ${i + 1}`}
                  aria-current={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  className="flex min-h-11 min-w-11 items-center justify-center p-2"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      i === activeIndex ? "w-6 bg-bio-dark" : "w-2 bg-bio-dark/25"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

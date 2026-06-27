"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { bioHero } from "@/data/bio-link"
import { ClaimLinkInput } from "@/components/marketing/biolink/claim-link"
import { PhoneDeviceFrame } from "@/components/device/phone-device-frame"
import { DbPublicProfileView } from "@/components/profile/db-public-profile-view"
import {
  DEMO_PREMIUM_LINKS,
  DEMO_PREMIUM_PROFILE,
  DEMO_SUMMER_LINKS,
  DEMO_SUMMER_PROFILE,
} from "@/lib/demo-profile"

export function BiolinkHero() {
  const [showPremium, setShowPremium] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setShowPremium((s) => !s), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative">
      <div className="bio-fade-up mx-auto flex w-[min(1200px,92%)] pt-32 max-lg:pt-24 max-md:flex-wrap">
        <div className="w-3/5 pl-10 text-bio-dark max-md:flex max-md:w-full max-md:flex-col max-md:items-center max-md:justify-center max-md:pl-0 max-md:text-center">
          <h1 className="mt-6 whitespace-pre-line text-7xl font-bold leading-[1.05] tracking-tighter max-lg:text-5xl max-sm:text-4xl">
            {bioHero.title}
          </h1>
          <h4 className="mt-6 w-4/5 text-xl font-normal leading-relaxed max-sm:mt-5 max-sm:w-11/12 max-sm:text-base">
            {bioHero.subtitle}
          </h4>
          <ClaimLinkInput className="mt-8 w-[min(470px,98%)] max-lg:w-[min(400px,98%)] max-sm:mt-6" />
        </div>

        <div className="flex w-2/5 items-center justify-center max-md:mt-10 max-md:w-full max-sm:mt-7">
          <div className="relative min-h-[580px] w-[268px] sm:w-[290px]">
            <AnimatePresence mode="wait">
              {showPremium ? (
                <motion.div
                  key="premium"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <PhoneDeviceFrame size="md" showLabel={false} glow>
                    <DbPublicProfileView
                      profile={DEMO_PREMIUM_PROFILE}
                      links={DEMO_PREMIUM_LINKS}
                      compact
                      verified
                    />
                  </PhoneDeviceFrame>
                </motion.div>
              ) : (
                <motion.div
                  key="summer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <PhoneDeviceFrame size="md" showLabel={false} glow>
                    <DbPublicProfileView
                      profile={DEMO_SUMMER_PROFILE}
                      links={DEMO_SUMMER_LINKS}
                      compact
                      verified
                    />
                  </PhoneDeviceFrame>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

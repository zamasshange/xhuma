"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioPricing, BIO_ASSETS } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { DarkButton, ArrowIcon } from "@/components/marketing/biolink/dark-button"

function GradientCheck() {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" className="mr-2 shrink-0" aria-hidden="true">
      <path
        d="M2 19.5V4.5L7.5095 5.4135V18.5865L2 19.5ZM9.702 18.5673V5.423H15.298V18.5673H9.702ZM23 19.5L17.4905 18.5865V5.4135L23 4.5V19.5Z"
        fill="url(#bioGrad)"
      />
      <defs>
        <linearGradient id="bioGrad" x1="2.9" y1="12" x2="12.6" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5858" />
          <stop offset="1" stopColor="#C058FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function BiolinkPricing() {
  const [yearly, setYearly] = useState(true)
  const price = yearly ? bioPricing.yearly : bioPricing.monthly

  return (
    <section className="relative mx-auto w-[min(900px,92%)] pt-28 max-lg:pt-16">
      <div className="mb-5 text-center">
        <SectionBadge>Pricing</SectionBadge>
      </div>
      <h1 className="relative z-10 text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        All features,
        <br />
        One simple plan
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BIO_ASSETS}/price-plan-bg.B1mGKs9M.png`}
        alt=""
        className="pointer-events-none absolute -left-4 top-10 -z-10 object-contain max-sm:-left-4"
      />

      <div className="relative mx-auto mt-10 flex w-[242px] rounded-full bg-white/60 px-1.5 py-[3px] max-sm:mt-6">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className="relative z-10 flex h-10 flex-1 items-center justify-center px-3 text-sm font-semibold text-bio-dark"
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className="relative z-10 flex h-10 flex-1 items-center justify-center px-3 text-sm font-semibold text-bio-dark"
        >
          Yearly (Save 50%)
        </button>
        <div
          className="absolute top-[5px] h-9 rounded-full bg-white shadow-md transition-transform duration-300"
          style={{
            width: yearly ? "147px" : "88px",
            transform: yearly ? "translateX(88px)" : "translateX(6px)",
          }}
        />
      </div>

      <div className="bio-plan-gradient mx-auto mt-10 w-[min(440px,100%)] rounded-[32px] p-1.5 max-sm:mt-8">
        <div className="rounded-[30px] bg-white p-10 text-bio-dark max-sm:p-5">
          <div className="flex items-center text-base font-semibold">
            Pro plan
            {yearly && (
              <span className="bio-shine relative ml-2 flex items-center overflow-hidden rounded-full bg-bio-green px-2.5 py-1 text-xs text-white">
                Save 50%
              </span>
            )}
          </div>
          <div className="mt-3 flex items-baseline border-b border-bio-dark/20 pb-6 max-sm:pb-3">
            <h2 className="text-5xl font-semibold max-sm:text-4xl">${price.toFixed(2)}</h2>
            <span className="mb-3 ml-1 text-base text-bio-grey">/mo</span>
          </div>
          <ul className="mt-6 space-y-4 max-sm:mt-3">
            {bioPricing.features.map((feature) => (
              <li key={feature} className="flex text-base max-sm:text-sm">
                <GradientCheck />
                {feature}
              </li>
            ))}
          </ul>
          <DarkButton href="/dashboard" className="mt-8 w-full">
            Try for free
            <ArrowIcon />
          </DarkButton>
        </div>
      </div>
    </section>
  )
}

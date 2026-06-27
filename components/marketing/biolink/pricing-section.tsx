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
      {/* Soft glow behind heading + card */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BIO_ASSETS}/price-plan-bg.B1mGKs9M.png`}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 w-[min(780px,130vw)] max-w-none -translate-x-1/2 object-contain"
      />

      <div className="relative z-10 mb-5 text-center">
        <SectionBadge>Pricing</SectionBadge>
      </div>
      <h1 className="relative z-10 text-center text-6xl font-semibold leading-[1.05] tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        All features,
        <br />
        One simple plan
      </h1>

      <div className="relative z-10 mx-auto mt-10 flex w-[250px] rounded-full bg-[#f0ebe3] p-1 max-sm:mt-6">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            "relative z-10 flex h-10 flex-1 items-center justify-center px-2 text-sm font-semibold transition-colors",
            !yearly ? "text-bio-dark" : "text-bio-grey",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            "relative z-10 flex h-10 flex-1 items-center justify-center px-2 text-sm font-semibold transition-colors",
            yearly ? "text-bio-dark" : "text-bio-grey",
          )}
        >
          Yearly (Save 50%)
        </button>
        <div
          className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_2px_10px_rgba(13,12,34,0.1)] transition-all duration-300 ease-out"
          style={{
            width: yearly ? "calc(58% - 4px)" : "calc(42% - 4px)",
            left: yearly ? "calc(42% + 2px)" : "4px",
          }}
        />
      </div>

      <div className="bio-plan-gradient relative z-10 mx-auto mt-10 w-[min(440px,100%)] rounded-[32px] p-1.5 max-sm:mt-8">
        <div className="rounded-[30px] bg-white p-10 text-bio-dark max-sm:p-5">
          <div className="flex items-center text-base font-semibold">
            Pro plan
            {yearly && (
              <span className="bio-shine relative ml-2 flex items-center overflow-hidden rounded-full bg-[#28c76f] px-2.5 py-1 text-xs font-semibold text-white">
                Save 50%
              </span>
            )}
          </div>
          <div className="mt-3 flex items-baseline border-b border-bio-dark/15 pb-6 max-sm:pb-3">
            <h2 className="text-5xl font-semibold tracking-tight max-sm:text-4xl">${price.toFixed(2)}</h2>
            <span className="mb-2 ml-1 text-base text-bio-grey">/mo</span>
          </div>
          <ul className="mt-6 space-y-4 max-sm:mt-3">
            {bioPricing.features.map((feature) => (
              <li key={feature} className="flex text-base leading-snug max-sm:text-sm">
                <GradientCheck />
                {feature}
              </li>
            ))}
          </ul>
          <DarkButton href="/sign-up" className="mt-8 w-full">
            Try for free
            <ArrowIcon />
          </DarkButton>
        </div>
      </div>
    </section>
  )
}

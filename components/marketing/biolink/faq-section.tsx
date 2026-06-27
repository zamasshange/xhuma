"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioFaqs } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      className={cn("shrink-0 transition-transform duration-300 max-sm:ml-4 max-sm:mt-1.5", open && "rotate-180")}
      aria-hidden="true"
    >
      <path d="M1.01172 1L7.97133 8L14.9309 1" stroke="#0D0C22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BiolinkFaq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0)
  const items = limit ? bioFaqs.slice(0, limit) : bioFaqs

  return (
    <section className="pt-36 max-lg:pt-16">
      <div className="mb-5 text-center">
        <SectionBadge>FAQ</SectionBadge>
      </div>
      <h1 className="text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        Got questions?
      </h1>
      <div className="mx-auto mt-10 w-[min(840px,92%)] space-y-3 max-sm:mt-6">
        {items.map((faq, i) => {
          const isOpen = open === i
          return (
            <button
              key={faq.q}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full flex-col items-stretch rounded-3xl bg-bio-grey px-6 py-6 text-left transition-all hover:bg-bio-grey max-sm:rounded-2xl max-sm:px-4 max-sm:py-4"
            >
              <div className="flex justify-between gap-4 md:items-center">
                <h3 className="text-base font-medium text-bio-dark max-sm:text-sm">{faq.q}</h3>
                <Chevron open={isOpen} />
              </div>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <p className="whitespace-pre-wrap text-base font-normal text-bio-dark/80 max-sm:text-sm">{faq.a}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

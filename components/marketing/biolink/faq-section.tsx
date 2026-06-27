"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioFaqs } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      className={cn("mt-1 shrink-0 transition-transform duration-300", open && "rotate-180")}
      aria-hidden="true"
    >
      <path
        d="M1.01172 1L7.97133 8L14.9309 1"
        stroke="#0D0C22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BiolinkFaq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(null)
  const items = limit ? bioFaqs.slice(0, limit) : bioFaqs

  return (
    <section className="bg-white pt-28 max-lg:pt-16">
      <div className="mb-5 text-center">
        <SectionBadge>FAQ</SectionBadge>
      </div>
      <h2 className="text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        Got questions?
      </h2>

      <div className="mx-auto mt-10 w-[min(840px,92%)] space-y-3 max-sm:mt-6">
        {items.map((faq, i) => {
          const isOpen = open === i
          return (
            <div key={faq.q} className="overflow-hidden rounded-2xl bg-bio-grey-f4 max-sm:rounded-xl">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left max-sm:px-4 max-sm:py-4"
              >
                <h3 className="text-base font-medium leading-snug text-bio-dark max-sm:text-sm">{faq.q}</h3>
                <Chevron open={isOpen} />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="whitespace-pre-wrap px-6 pb-5 text-base font-normal leading-relaxed text-bio-dark/80 max-sm:px-4 max-sm:pb-4 max-sm:text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { CreatorCard } from "@/components/cards/creator-card"
import { exploreCards, exploreCategories } from "@/data/explore"
import { cn } from "@/lib/utils"

export default function ExplorePage() {
  const [category, setCategory] = useState<(typeof exploreCategories)[number]>("All")
  const filtered =
    category === "All" ? exploreCards : exploreCards.filter((c) => c.category === category)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Explore"
          title="Beautiful pages from real creators"
          description="Browse stunning Link in Bio pages across every niche. Tap any card to see the full experience."
          align="left"
        />
      </Reveal>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {exploreCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              category === cat
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card, i) => (
          <Reveal key={`${card.username}-${card.name}`} delay={i * 0.04}>
            <CreatorCard card={card} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

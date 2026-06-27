"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { bioFeatures, bioSiteExtras } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"

/** bio.link feature bento — title on top, illustration anchored to bottom */
function FeatureCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-[32px] bg-[#f4f4f4] p-10 text-bio-dark max-sm:rounded-3xl max-sm:p-6",
        className,
      )}
    >
      <h3 className="shrink-0 text-2xl font-semibold leading-snug tracking-tight max-sm:text-xl">
        {title}
      </h3>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>
    </article>
  )
}

function FeatureIllustration({ src, className }: { src: string; className?: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-end justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={cn("block max-h-full w-full object-contain object-bottom", className)}
      />
    </div>
  )
}

const SLIDE_W = 158

function FeatureCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % bioSiteExtras.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-0 flex-1">
      <div className="absolute inset-x-0 bottom-10 top-0 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 flex items-end transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * SLIDE_W + SLIDE_W / 2}px)` }}
        >
          {bioSiteExtras.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              className="flex w-[158px] shrink-0 justify-center"
              aria-label={item.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.label}
                draggable={false}
                className={cn(
                  "h-auto w-[142px] object-contain transition-all duration-500",
                  i === active ? "scale-100 opacity-100" : "scale-[0.8] opacity-25",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {bioSiteExtras.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all",
              i === active ? "size-2.5 bg-white shadow-sm" : "size-2 bg-[#d9d9d9]",
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function BiolinkFeaturesGrid() {
  const [domain, carousel, stats] = bioFeatures.slice(0, 3)
  const embed = bioFeatures.find((f) => f.id === "embed")!
  const websites = bioFeatures.find((f) => f.id === "websites")!
  const bottom = bioFeatures.filter((f) => ["subscribers", "posts", "qr"].includes(f.id))

  return (
    <section className="isolate mx-auto w-[min(1300px,92%)] pt-20 text-bio-dark max-lg:pt-16">
      <div className="mb-5 text-center">
        <SectionBadge>Features</SectionBadge>
      </div>
      <h2 className="text-center text-6xl font-semibold leading-[1.05] tracking-tighter max-lg:text-5xl max-sm:text-4xl">
        Next level features,
        <br />
        unmatched value
      </h2>

      <div className="mt-14 flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          <FeatureCard title={domain.title} className="h-[440px] max-lg:h-auto max-lg:min-h-[400px]">
            <FeatureIllustration src={domain.image} />
          </FeatureCard>
          <FeatureCard title={carousel.title} className="h-[440px] max-lg:h-auto max-lg:min-h-[400px]">
            <FeatureCarousel />
          </FeatureCard>
          <FeatureCard title={stats.title} className="h-[440px] max-lg:h-auto max-lg:min-h-[400px]">
            <FeatureIllustration src={stats.image} />
          </FeatureCard>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-1">
          <FeatureCard
            title={embed.title}
            className="col-span-2 h-[400px] max-lg:col-span-1 max-lg:h-auto max-lg:min-h-[360px]"
          >
            <FeatureIllustration src={embed.image} />
          </FeatureCard>
          <FeatureCard
            title={websites.title}
            className="col-span-3 h-[400px] max-lg:col-span-1 max-lg:h-auto max-lg:min-h-[360px]"
          >
            <FeatureIllustration src={websites.image} className="origin-bottom scale-[1.06]" />
          </FeatureCard>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {bottom.map((f) => (
            <FeatureCard
              key={f.id}
              title={f.title}
              className="h-[380px] max-lg:h-auto max-lg:min-h-[340px]"
            >
              <FeatureIllustration src={f.image} />
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  )
}

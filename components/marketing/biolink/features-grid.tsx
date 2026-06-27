"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioFeatures, bioSiteExtras } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"

function FeatureCarousel() {
  const [active, setActive] = useState(0)

  return (
    <div className="relative overflow-hidden">
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-0">
          {bioSiteExtras.map((item, i) => {
            const isActive = i === active
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                className="w-[200px] shrink-0 transition-all max-sm:w-[180px]"
              >
                <div
                  className="transition-transform duration-500"
                  style={{ transform: isActive ? "scale(1.15)" : "scale(0.75)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.label}
                    className={cn("w-full object-cover transition-opacity duration-500", !isActive && "opacity-50")}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-2 max-sm:bottom-6">
        {bioSiteExtras.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "size-2.5 rounded-full transition-all max-sm:size-2",
              i === active ? "bg-white shadow" : "bg-bio-grey-d9",
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  image,
  carousel,
}: {
  title: string
  image: string
  carousel?: boolean
}) {
  return (
    <div className="relative flex h-[440px] flex-col rounded-3xl bg-bio-grey p-10 max-lg:h-auto max-lg:p-6 max-sm:flex max-sm:h-[330px] max-sm:flex-col max-sm:justify-between max-sm:pb-0">
      <h3 className="text-2xl font-semibold max-sm:text-xl">{title}</h3>
      {carousel ? (
        <div className="mt-auto">
          <FeatureCarousel />
        </div>
      ) : (
        image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="absolute bottom-0 left-0 right-0 mx-auto h-auto w-[72%] max-sm:relative max-sm:mt-4 max-sm:w-[60%]"
          />
        )
      )}
    </div>
  )
}

export function BiolinkFeaturesGrid() {
  const row1 = bioFeatures.slice(0, 3)
  const embed = bioFeatures.find((f) => f.id === "embed")!
  const websites = bioFeatures.find((f) => f.id === "websites")!
  const row3 = bioFeatures.filter((f) => ["subscribers", "posts", "qr"].includes(f.id))

  return (
    <section className="mx-auto w-[min(1300px,92%)] pt-20 text-bio-dark max-lg:pt-16 max-md:pt-0">
      <div className="mb-5 text-center">
        <SectionBadge>Features</SectionBadge>
      </div>
      <h2 className="text-center text-6xl font-semibold leading-tight tracking-tighter max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        Next level features,
        <br />
        unmatched value
      </h2>

      <div className="mt-14 space-y-6">
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-y-6">
          {row1.map((f) => (
            <FeatureCard key={f.id} title={f.title} image={f.image} carousel={f.carousel} />
          ))}
          <div className="hidden max-lg:block">
            <FeatureCard title={embed.title} image={embed.image} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-y-6">
          <div className="col-span-2 max-lg:hidden">
            <FeatureCard title={embed.title} image={embed.image} />
          </div>
          <div className="col-span-3 max-lg:col-span-1 max-sm:col-span-1">
            <div className="flex h-[350px] flex-col rounded-3xl bg-bio-grey p-10 max-lg:h-auto max-lg:p-6 max-sm:h-[330px]">
              <h3 className="text-2xl font-semibold max-sm:text-xl">{websites.title}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={websites.image} alt="" className="mt-3 h-auto w-full self-end" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:gap-y-6 max-sm:grid-cols-1">
          {row3.map((f) => (
            <div key={f.id} className="flex h-[380px] flex-col overflow-hidden rounded-3xl bg-bio-grey p-10 max-lg:p-6 max-md:h-auto max-sm:h-[330px]">
              <h3 className="text-2xl font-semibold max-sm:text-xl">{f.title}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="" className="mx-auto mt-2.5 h-auto w-full self-end object-cover max-md:max-h-[280px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioTestimonialSocialProof } from "@/data/bio-link"
import { SITE_NAME } from "@/lib/brand"
import { useRegion } from "@/components/providers/region-provider"
import { getRegionalTestimonials } from "@/lib/region/content"

function TestimonialAvatar({
  avatar,
  initials,
  color,
  name,
}: {
  avatar?: string
  initials?: string
  color?: string
  name: string
}) {
  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="" className="size-11 shrink-0 rounded-full object-cover" />
    )
  }
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: color ?? "#717171" }}
      aria-hidden
    >
      {initials ?? name.slice(0, 2).toUpperCase()}
    </span>
  )
}

function TestimonialCard({ t }: { t: ReturnType<typeof getRegionalTestimonials>[0] }) {
  return (
    <article className="bio-testimonial-card mb-5 break-inside-avoid">
      <div className="flex items-center gap-3">
        <TestimonialAvatar
          avatar={t.avatar}
          initials={t.initials}
          color={t.avatarColor}
          name={t.name}
        />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-bio-dark">{t.name}</p>
          <p className="text-sm text-bio-grey">{t.location}</p>
        </div>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold leading-snug text-bio-dark">{t.headline}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-bio-dark/75">{t.body}</p>
    </article>
  )
}

export function TestimonialsSection() {
  const { code: region } = useRegion()
  const testimonials = getRegionalTestimonials(region)
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? testimonials : testimonials.slice(0, 9)

  return (
    <section className="relative overflow-hidden bg-[#f9f9f9] pt-28 pb-32 max-lg:pt-20 max-lg:pb-28">
      <h2 className="text-center text-5xl font-semibold tracking-tighter text-bio-dark max-lg:text-4xl max-sm:px-4 max-sm:text-3xl">
        See what people are saying
      </h2>

      <div className="relative mx-auto mt-12 w-[min(1100px,92%)] max-sm:mt-8">
        <div
          className={cn(
            "columns-1 gap-5 sm:columns-2 lg:columns-3",
            !expanded && "bio-testimonials-fade max-h-[920px] overflow-hidden",
          )}
        >
          {visible.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>

        {!expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f9f9f9] via-[#f9f9f9]/90 to-transparent"
            aria-hidden
          />
        )}
      </div>

      <div className="relative z-10 mx-auto -mt-6 flex justify-center px-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="bio-testimonial-cta flex items-center gap-3 rounded-full bg-bio-dark py-2.5 pl-2.5 pr-2 text-white shadow-[0_12px_40px_rgba(13,12,34,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98] max-sm:gap-2"
        >
          <span className="flex -space-x-2 pl-1">
            {bioTestimonialSocialProof.avatars.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="size-8 rounded-full border-2 border-bio-dark object-cover"
                style={{ zIndex: 3 - i }}
              />
            ))}
          </span>
          <span className="text-center text-sm font-medium max-sm:max-w-[140px] max-sm:whitespace-normal sm:whitespace-nowrap">
            +{bioTestimonialSocialProof.count} users enjoy {SITE_NAME}
          </span>
          <span className="ml-1 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold max-sm:px-2 max-sm:text-xs">
            {expanded ? "Show less" : "View more"}
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full bg-white text-bio-dark transition-transform",
                expanded && "rotate-45",
              )}
              aria-hidden
            >
              +
            </span>
          </span>
        </button>
      </div>
    </section>
  )
}

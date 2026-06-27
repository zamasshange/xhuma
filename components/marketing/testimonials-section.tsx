import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { Avatar } from "@/components/ui/avatar"
import { testimonials } from "@/data/marketing"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Loved by creators"
            title="Built for the people who build audiences"
            description="Join millions of creators, artists, and founders who trust Linkly to power their presence."
          />
        </Reveal>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06} className="break-inside-avoid">
              <figure className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex gap-0.5 text-brand">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-pretty text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar src={t.avatar} alt={t.name} className="size-10" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

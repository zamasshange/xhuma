import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { Icon } from "@/components/icon"
import { features } from "@/data/marketing"

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Everything you need"
          title="One page. Endless possibilities."
          description="Powerful tools that make your Link in Bio feel like a premium product — without writing a single line of code."
        />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.06}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-brand-gradient flex size-11 items-center justify-center rounded-xl text-brand-foreground shadow-sm">
                <Icon name={feature.icon} className="size-5" />
              </div>
              <h3 className="font-heading mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { aboutStats, team, timeline } from "@/data/about"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("about")

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="We're building the future of creator presence"
          description="Xhuma helps South African creators and businesses own their audience with beautiful, AI-powered Link in Bio pages."
          align="left"
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aboutStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.05}>
            <Card className="p-5 text-center">
              <p className="font-heading text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold">Our mission</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Give every creator a premium, owned presence on the internet — without code, without compromise, and
              without giving up their audience to algorithms.
            </p>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold">Our vision</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A world where your single link is as powerful as a full website — intelligent, beautiful, and entirely
              yours. AI that amplifies your voice, never replaces it.
            </p>
          </Card>
        </Reveal>
      </section>

      <section className="mt-20">
        <Reveal>
          <SectionHeading title="Our journey" align="left" />
        </Reveal>
        <div className="mt-8 flex flex-col gap-6">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.06}>
              <div className="flex gap-4 sm:gap-6">
                <div className="font-heading w-16 shrink-0 text-lg font-semibold text-brand sm:w-20">{item.year}</div>
                <Card className="flex-1 p-5">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Reveal>
          <SectionHeading title="Meet the team" description="A small team with big ambitions." align="left" />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.05}>
              <Card className="p-5">
                <Avatar src={member.avatar} alt={member.name} className="size-14" />
                <h3 className="font-heading mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-brand">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

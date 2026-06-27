import Link from "next/link"
import { bioCreators } from "@/data/bio-link"

export function CreatorMarquee() {
  const items = [...bioCreators, ...bioCreators]

  return (
    <section className="pt-28 max-lg:pt-16">
      <h2 className="text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        Loved by top creators
      </h2>
      <div className="relative mt-8 overflow-hidden">
        <div className="bio-marquee flex w-max gap-4 whitespace-nowrap">
          {items.map((creator, i) => (
            <Link
              key={`${creator.username}-${i}`}
              href={`/${creator.username === "charlymatashow" ? "ariastone" : creator.username === "austinarcher" ? "mayadev" : "leoart"}`}
              className="block h-[220px] w-[180px] shrink-0 overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={creator.image} alt={creator.name} className="size-full object-cover" />
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white via-white/50 to-transparent max-sm:w-16" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white via-white/50 to-transparent max-sm:w-16" />
      </div>
    </section>
  )
}

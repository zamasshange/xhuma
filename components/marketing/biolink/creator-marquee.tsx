import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile } from "@/lib/database.types"
import { detectRegion } from "@/lib/region/detect"
import { getRegionalCreators } from "@/lib/region/content"

export async function CreatorMarquee() {
  const region = await detectRegion()
  const fallbackCreators = getRegionalCreators(region)
  let creators: { username: string; name: string; image: string; href: string }[] = []

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .order("created_at", { ascending: false })
      .limit(14)

    if (data && data.length >= 3) {
      creators = data.map((p) => {
        const profile = mapProfile(p as Record<string, unknown>)
        const fallback = fallbackCreators.find((c) => c.username === profile.username)
        return {
          username: profile.username,
          name: profile.display_name,
          image: profile.avatar_url || fallback?.image || fallbackCreators[0].image,
          href: `/${profile.username}`,
        }
      })
    }
  } catch {
    // fall through to static creators
  }

  if (creators.length === 0) {
    creators = fallbackCreators.map((c) => ({
      username: c.username,
      name: c.name,
      image: c.image,
      href: `/editor?username=${c.username}`,
    }))
  }

  const items = [...creators, ...creators]

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
              href={creator.href}
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

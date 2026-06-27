import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile } from "@/lib/database.types"
import { PublicProfileCard } from "@/components/cards/public-profile-card"
import { SectionHeading } from "@/components/section-heading"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("explore")

async function getPublicProfiles() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme_json, created_at")
      .order("created_at", { ascending: false })
      .limit(48)
    return (data ?? []).map((row) => mapProfile(row as Record<string, unknown>))
  } catch {
    return []
  }
}

export default async function ExplorePage() {
  const profiles = await getPublicProfiles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-bio-dark sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="Explore"
        title="Live pages on Xhuma"
        description="Real link-in-bio pages built on Xhuma. Tap any card to visit, or create your own in seconds."
        align="left"
      />

      {profiles.length === 0 ? (
        <div className="mt-12 rounded-3xl border-2 border-dashed border-bio-dark/15 bg-bio-grey-f4 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-bio-dark">No public pages yet</p>
          <p className="mt-2 text-bio-grey">Be the first creator — claim your link and go live.</p>
          <DarkButton href="/editor" className="mx-auto mt-8 w-[220px]">
            Start for free
          </DarkButton>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <PublicProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-bio-grey">
        Want your page here?{" "}
        <Link href="/editor" className="font-semibold text-bio-dark hover:underline">
          Create your page
        </Link>
      </p>
    </div>
  )
}

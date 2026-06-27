import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile } from "@/lib/database.types"
import { resolveThemeBackground } from "@/lib/theme-presets"
import { fetchActiveLinksForUser } from "@/lib/supabase/fetch-links"
import { PublicProfilePageClient } from "./public-profile-client"
import { JsonLd } from "@/components/seo/json-ld"
import { profileMetadata, absoluteUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"

async function fetchPublicProfile(username: string) {
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle()

  if (!profile) return null

  const links = await fetchActiveLinksForUser(supabase, profile.id)

  const mapped = mapProfile(profile)

  return {
    profile: {
      ...mapped,
      theme_json: resolveThemeBackground(mapped.theme_json),
    },
    links,
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const data = await fetchPublicProfile(username)
  if (!data) return { title: "Profile not found" }

  const { profile } = data
  return profileMetadata({
    displayName: profile.display_name,
    username: profile.username,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
  })
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await fetchPublicProfile(username)
  if (!data) notFound()

  const { profile, links } = data

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: profile.display_name,
    description: profile.bio ?? `Link in bio page for ${profile.display_name} on Xhuma`,
    url: absoluteUrl(`/${profile.username}`),
    isPartOf: { "@type": "WebSite", name: "Xhuma", url: absoluteUrl("/") },
    mainEntity: {
      "@type": "Person",
      name: profile.display_name,
      alternateName: `@${profile.username}`,
      description: profile.bio ?? undefined,
      image: profile.avatar_url ?? undefined,
      url: absoluteUrl(`/${profile.username}`),
      sameAs: links.map((l) => l.url).filter((u) => u && u !== "#"),
    },
  }

  return (
    <>
      <JsonLd data={profileJsonLd} />
      <PublicProfilePageClient profile={profile} links={links} />
    </>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile, type DbLink } from "@/lib/database.types"
import { PublicProfilePageClient } from "./public-profile-client"
import { JsonLd } from "@/components/seo/json-ld"
import { profileMetadata, absoluteUrl } from "@/lib/seo"

async function fetchPublicProfile(username: string) {
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle()

  if (!profile) return null

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, icon, position")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true })

  return {
    profile: mapProfile(profile),
    links: (links ?? []) as Pick<DbLink, "id" | "title" | "url" | "icon">[],
  }
}

const getCachedProfile = (username: string) =>
  unstable_cache(() => fetchPublicProfile(username), [`profile-${username}`], {
    revalidate: 60,
    tags: [`profile-${username}`],
  })()

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const data = await getCachedProfile(username)
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
  const data = await getCachedProfile(username)
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

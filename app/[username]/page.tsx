import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile, type DbLink } from "@/lib/database.types"
import { PublicProfilePageClient } from "./public-profile-client"
import { JsonLd } from "@/components/seo/json-ld"
import { absoluteUrl, buildMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/brand"

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
  const title = `${profile.display_name} (@${profile.username})`
  const description =
    profile.bio?.trim() ||
    `Visit ${profile.display_name}'s link in bio page on ${SITE_NAME} — links, socials, and more.`

  return buildMetadata({
    title,
    description,
    path: `/${profile.username}`,
    image: profile.avatar_url,
    type: "profile",
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
    description: profile.bio ?? undefined,
    url: absoluteUrl(`/${profile.username}`),
    mainEntity: {
      "@type": "Person",
      name: profile.display_name,
      alternateName: profile.username,
      description: profile.bio ?? undefined,
      image: profile.avatar_url ?? undefined,
      url: absoluteUrl(`/${profile.username}`),
      sameAs: links.map((l) => l.url).filter(Boolean),
    },
  }

  return (
    <>
      <JsonLd data={profileJsonLd} />
      <PublicProfilePageClient profile={profile} links={links} />
    </>
  )
}

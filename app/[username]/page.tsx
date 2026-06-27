import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { DbLink, DbProfile } from "@/lib/database.types"
import { PublicProfilePageClient } from "./public-profile-client"

async function fetchPublicProfile(username: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme")
    .eq("username", username.toLowerCase())
    .single()

  if (!profile) return null

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, position")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true })

  return { profile: profile as DbProfile, links: (links ?? []) as Pick<DbLink, "id" | "title" | "url">[] }
}

const getCachedProfile = (username: string) =>
  unstable_cache(() => fetchPublicProfile(username), [`profile-${username}`], {
    revalidate: 60,
    tags: [`profile-${username}`],
  })()

export const revalidate = 60

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getCachedProfile(username)
  if (!data) notFound()

  return <PublicProfilePageClient profile={data.profile} links={data.links} />
}

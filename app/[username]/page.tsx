import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile, type DbLink } from "@/lib/database.types"
import { PublicProfilePageClient } from "./public-profile-client"

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

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getCachedProfile(username)
  if (!data) notFound()

  return <PublicProfilePageClient profile={data.profile} links={data.links} />
}

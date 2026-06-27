import { createClient } from "@/lib/supabase/server"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return apiError("Unauthorized", 401)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [viewsRes, clicksRes, linksRes, recentViewsRes, recentClicksRes] = await Promise.all([
    supabase.from("profile_views").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("link_clicks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("links").select("id, title, clicks").eq("user_id", user.id).order("clicks", { ascending: false }),
    supabase
      .from("profile_views")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("link_clicks")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString()),
  ])

  const topLinks = (linksRes.data ?? []).slice(0, 5)
  const totalClicks = (linksRes.data ?? []).reduce((sum, l) => sum + l.clicks, 0)

  return apiSuccess({
    profileViews: viewsRes.count ?? 0,
    linkClicks: clicksRes.count ?? 0,
    totalLinkClicksCounter: totalClicks,
    topLinks,
    recentViews: recentViewsRes.data?.length ?? 0,
    recentClicks: recentClicksRes.data?.length ?? 0,
  })
}

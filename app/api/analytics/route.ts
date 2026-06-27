import { createAdminClient, requireUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function GET(request: Request) {
  const userId = requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const supabase = createAdminClient()

  const [viewsRes, clicksRes, linksRes] = await Promise.all([
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "view"),
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "click"),
    supabase.from("links").select("id, title, clicks").eq("user_id", userId).order("clicks", { ascending: false }),
  ])

  const topLinks = (linksRes.data ?? []).slice(0, 5)
  const totalClicks = (linksRes.data ?? []).reduce((sum, l) => sum + l.clicks, 0)

  return apiSuccess({
    profileViews: viewsRes.count ?? 0,
    linkClicks: clicksRes.count ?? 0,
    totalLinkClicksCounter: totalClicks,
    topLinks,
    recentViews: viewsRes.count ?? 0,
    recentClicks: clicksRes.count ?? 0,
  })
}

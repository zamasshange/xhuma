import { createClient } from "@/lib/supabase/server"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("track_link_click", { p_link_id: id })

  if (error || !data?.[0]) return apiError("Link not found", 404)

  const row = data[0] as { url: string; clicks: number }
  return apiSuccess({ url: row.url, clicks: row.clicks })
}

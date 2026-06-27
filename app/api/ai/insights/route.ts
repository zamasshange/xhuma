import { apiSuccess } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"

type AnalyticsInput = {
  profileViews: number
  linkClicks: number
  topLinks: { title: string; clicks: number }[]
}

function mockInsights(data: AnalyticsInput): string[] {
  const insights: string[] = []
  const total = data.topLinks.reduce((s, l) => s + l.clicks, 0) || 1

  if (data.topLinks.length > 0) {
    const top = data.topLinks[0]
    const pct = Math.round((top.clicks / total) * 100)
    insights.push(`Your "${top.title}" link receives ${pct}% of all clicks — consider keeping it near the top.`)
  }

  if (data.topLinks.length >= 4) {
    const fourth = data.topLinks[3]
    insights.push(`Most visitors stop engaging after your fourth button — "${fourth.title}" gets fewer clicks than links above it.`)
  }

  const whatsapp = data.topLinks.find((l) => /whatsapp|wa\.me/i.test(l.title))
  if (whatsapp && whatsapp.clicks > total * 0.3) {
    insights.push("Your WhatsApp link performs extremely well — a strong sign for SA audiences.")
  }

  if (data.profileViews > 0 && data.linkClicks / data.profileViews < 0.3) {
    insights.push("Your click-through rate is low — a stronger bio and profile photo could improve engagement.")
  }

  if (insights.length === 0) {
    insights.push("Add more links and share your page to start seeing meaningful analytics insights.")
  }

  return insights
}

export async function POST(request: Request) {
  const body = await request.json()
  const analytics = body.analytics as AnalyticsInput

  const { data, error } = await aiJsonChat<{ insights: string[] }>(
    `Analyse this link-in-bio analytics for a South African creator. Return JSON: { "insights": [3-5 short natural-language insights] }
Data: ${JSON.stringify(analytics)}
Mention specific link names and percentages where possible. Suggest actionable improvements.`,
    { temperature: 0.5 },
  )

  const insights = data?.insights ?? mockInsights(analytics ?? { profileViews: 0, linkClicks: 0, topLinks: [] })
  return apiSuccess({ insights, mock: !data, aiError: error })
}

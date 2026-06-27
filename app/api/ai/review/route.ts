import { apiSuccess } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { computeProfileHealth } from "@/lib/ai/profile-health"
import type { EditorState } from "@/lib/editor-state"

type ReviewCheck = {
  id: string
  label: string
  passed: boolean
  detail: string
  fix?: { type: string; value?: string }
}

function mockReview(state: EditorState | null): { score: number; checks: ReviewCheck[]; ready: boolean } {
  if (!state) {
    return { score: 0, checks: [], ready: false }
  }

  const health = computeProfileHealth(state)
  const checks: ReviewCheck[] = [
    {
      id: "bio",
      label: "Bio quality",
      passed: (state.profile.bio?.length ?? 0) >= 30,
      detail: "A clear bio helps visitors understand you instantly.",
      fix: { type: "improve_bio" },
    },
    {
      id: "links",
      label: "Link quality",
      passed: state.links.filter((l) => l.is_active !== false).length >= 2,
      detail: "At least two strong links give visitors options.",
    },
    {
      id: "mobile",
      label: "Mobile readability",
      passed: state.links.filter((l) => l.title.length > 35).length === 0,
      detail: "Keep button labels short for mobile screens.",
    },
    {
      id: "cta",
      label: "CTA strength",
      passed: health.checks.find((c) => c.id === "cta")?.passed ?? false,
      detail: "Use action-led labels instead of platform names alone.",
      fix: { type: "improve_labels" },
    },
    {
      id: "branding",
      label: "Branding consistency",
      passed: !!state.profile.display_name && !!state.profile.theme.bg,
      detail: "Name and colours should feel cohesive.",
    },
    {
      id: "complete",
      label: "Profile completeness",
      passed: health.score >= 80,
      detail: `Profile score: ${health.score}/100`,
    },
    {
      id: "seo",
      label: "SEO readiness",
      passed: state.profile.display_name.length >= 2 && (state.profile.bio?.length ?? 0) >= 15,
      detail: "Name and bio help search and social previews.",
    },
  ]

  const passed = checks.filter((c) => c.passed).length
  return {
    score: Math.round((passed / checks.length) * 100),
    checks,
    ready: passed >= checks.length - 1,
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const state = body.state as EditorState | null

  const base = mockReview(state)

  const { data, error } = await aiJsonChat<{ checks: ReviewCheck[]; summary: string }>(
    `Pre-publish review for a Xhuma link-in-bio page. Context:
${JSON.stringify(state, null, 2)}

Return JSON:
{
  "checks": [{ "id": string, "label": string, "passed": boolean, "detail": string, "fix": { "type": string } | null }],
  "summary": "one encouraging sentence"
}
Include: bio quality, link quality, mobile readability, CTA strength, branding, completeness, SEO.`,
    { temperature: 0.4 },
  )

  if (data?.checks?.length) {
    return apiSuccess({
      ...base,
      checks: data.checks,
      summary: data.summary,
      mock: false,
    })
  }

  return apiSuccess({
    ...base,
    summary: base.ready
      ? "Your page looks great — ready to publish!"
      : "A few quick fixes will make your page shine.",
    mock: true,
    aiError: error,
  })
}

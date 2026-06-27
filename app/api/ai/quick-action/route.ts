import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { getRecommendedLinks, inferProfession } from "@/lib/ai/link-recommendations"
import type { EditorState } from "@/lib/editor-state"

const ACTIONS = [
  "improve_profile",
  "more_professional",
  "simplify",
  "add_missing_links",
  "better_bio",
  "improve_branding",
  "refresh_colors",
  "organize_links",
  "better_layout",
] as const

type ActionId = (typeof ACTIONS)[number]

type QuickActionResult = {
  profile?: Partial<EditorState["profile"]>
  links?: { title: string; url: string; icon?: string }[]
  reorder_link_ids?: string[]
  theme?: EditorState["profile"]["theme"]
  sections?: string[]
  message: string
}

function mockQuickAction(action: ActionId, state: EditorState | null): QuickActionResult {
  const bio = state?.profile.bio ?? ""
  const profession = inferProfession(bio + " " + (state?.profile.display_name ?? ""))

  switch (action) {
    case "better_bio":
      return {
        profile: {
          bio: bio || `${state?.profile.display_name ?? "Creator"} sharing work and connecting with my audience across South Africa.`,
        },
        message: "Bio updated with a clearer introduction.",
      }
    case "add_missing_links": {
      const existing = new Set((state?.links ?? []).map((l) => l.title.toLowerCase()))
      const recs = getRecommendedLinks(profession).filter((r) => !existing.has(r.title.toLowerCase()))
      return {
        links: recs.slice(0, 3).map((r) => ({ title: r.title, url: r.url, icon: r.icon })),
        message: `Added ${Math.min(3, recs.length)} recommended links for your page type.`,
      }
    }
    case "simplify": {
      const active = (state?.links ?? []).filter((l) => l.is_active !== false)
      if (active.length <= 5) {
        return { message: "Your page is already concise — nice work!" }
      }
      return { message: "Consider keeping your top 5 links and archiving the rest." }
    }
    case "refresh_colors":
      return {
        theme: { bg: "#0f172a", text: "#e2e8f0", button: "#2563eb", button_text: "#ffffff", radius: "14px", preset_id: "rainy" },
        message: "Applied a fresh professional blue palette.",
      }
    case "more_professional":
      return {
        profile: {
          bio: bio
            ? bio.replace(/\b(hi|hey|lol)\b/gi, "").trim()
            : "Professional services tailored for clients across South Africa. Connect below to get started.",
        },
        message: "Profile tone adjusted to sound more professional.",
      }
    default:
      return {
        message: "Try the AI assistant for specific suggestions on this area.",
      }
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const action = body.action as ActionId
  const state = body.state as EditorState | null

  if (!action || !ACTIONS.includes(action)) return apiError("Invalid action")

  const { data, error } = await aiJsonChat<QuickActionResult>(
    `Quick action: "${action}" for a South African creator's link-in-bio page.
Current state: ${JSON.stringify(state)}

Return JSON:
{
  "profile": { "display_name"?, "bio"? } | omit if unchanged,
  "links": [{ "title", "url", "icon"? }] | only new links to add,
  "theme": { colours } | only if refresh_colors or improve_branding,
  "sections": string[] | only if better_layout,
  "message": "what changed"
}
Keep changes minimal and practical.`,
    { temperature: 0.6 },
  )

  const result = data ?? mockQuickAction(action, state)
  return apiSuccess({ result, mock: !data, aiError: error })
}

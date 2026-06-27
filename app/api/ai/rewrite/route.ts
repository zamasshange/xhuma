import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { REWRITE_TONES, type RewriteTone } from "@/lib/ai/system-prompt"

const MOCK: Record<string, string> = {
  bio: "Creator & storyteller sharing work, wins, and behind-the-scenes from South Africa.",
  display_name: "Your Name",
  link_title: "Explore My Work",
  about: "I help people discover my work and connect with me online.",
}

export async function POST(request: Request) {
  const body = await request.json()
  const field = body.field as "bio" | "display_name" | "link_title" | "about" | undefined
  const text = body.text as string | undefined
  const tone = (body.tone as RewriteTone) ?? "professional"
  const context = body.context as string | undefined

  if (!field) return apiError("Field is required")
  if (!text?.trim() && field !== "display_name") return apiError("Text is required")

  const toneLabel = REWRITE_TONES.includes(tone) ? tone : "professional"

  const { data, error } = await aiJsonChat<{ result: string }>(
    `Rewrite this ${field.replace("_", " ")} in a ${toneLabel} tone for a South African link-in-bio page.
${context ? `Context: ${context}` : ""}
Original: "${text ?? ""}"
Return JSON: { "result": "rewritten text" } — max 120 chars for bio, max 40 for button labels.`,
    { temperature: 0.8 },
  )

  const result = data?.result ?? MOCK[field] ?? text ?? ""
  return apiSuccess({ result, mock: !data, aiError: error })
}

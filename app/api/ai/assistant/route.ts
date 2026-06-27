import { apiSuccess, apiError } from "@/lib/api-response"
import { aiTextChat } from "@/lib/ai/server"
import { buildEditorContextPayload } from "@/lib/ai/editor-context"

export async function POST(request: Request) {
  const body = await request.json()
  const message = body.message as string | undefined
  const context = body.context as {
    tab?: string
    username?: string
    state?: import("@/lib/editor-state").EditorState | null
  }

  if (!message?.trim()) return apiError("Message is required")

  const ctx = buildEditorContextPayload(
    context?.state ?? null,
    (context?.tab as "page" | "analytics" | "ai" | "settings") ?? "page",
    context?.username,
  )

  const history = Array.isArray(body.history)
    ? (body.history as { role: "user" | "assistant"; content: string }[])
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }))
    : []

  const { text, error } = await aiTextChat(message, {
    systemExtra: `You are helping edit a Xhuma link-in-bio page. Current editor context:\n${JSON.stringify(ctx, null, 2)}\n\nAnswer helpfully in 2-4 sentences. Suggest concrete next steps when relevant.`,
    history,
  })

  if (!text) {
    const fallback = getMockReply(message, ctx)
    return apiSuccess({ reply: fallback, mock: true, aiError: error })
  }

  return apiSuccess({ reply: text })
}

function getMockReply(message: string, ctx: Record<string, unknown>): string {
  const m = message.toLowerCase()
  if (/bio|about/.test(m)) {
    return "Try a bio that states what you do, who you help, and one clear call-to-action. Use the Improve with AI button next to your bio for tone options."
  }
  if (/link|button|cta/.test(m)) {
    return "Lead with your most important link — often WhatsApp or your main platform for SA creators. Use action-led labels like \"Book on WhatsApp\" instead of just \"WhatsApp\"."
  }
  if (/theme|colour|color/.test(m)) {
    return "Open the Theme section or describe your vibe in the AI Theme Assistant — e.g. \"luxury black and gold\" or \"bright and playful\"."
  }
  const links = (ctx.link_count as number) ?? 0
  if (links === 0) {
    return "Your page has no links yet. Add WhatsApp, Instagram, or your portfolio first — those convert best for South African audiences."
  }
  return "I'm here to help you polish your Xhuma page. Ask about bios, links, themes, or layout — or try Quick Actions for one-click improvements."
}

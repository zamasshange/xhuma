import { env } from "@/lib/env"

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

export type OpenRouterResult =
  | { ok: true; content: string }
  | { ok: false; error: string }

export async function openrouterChat(
  messages: ChatMessage[],
  options?: { temperature?: number },
): Promise<OpenRouterResult> {
  if (!env.openrouter.apiKey) {
    return { ok: false, error: "OPENROUTER_API_KEY is not configured in .env.local" }
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openrouter.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.siteUrl,
        "X-Title": "Xhuma",
      },
      body: JSON.stringify({
        model: env.openrouter.model,
        messages,
        temperature: options?.temperature ?? 0.7,
      }),
    })

    const raw = await res.text()
    if (!res.ok) {
      return {
        ok: false,
        error: `OpenRouter ${res.status}: ${raw.slice(0, 240)}`,
      }
    }

    let json: { choices?: { message?: { content?: string } }[] }
    try {
      json = JSON.parse(raw)
    } catch {
      return { ok: false, error: "OpenRouter returned invalid JSON" }
    }

    const content = json.choices?.[0]?.message?.content?.trim()
    if (!content) return { ok: false, error: "OpenRouter returned empty content" }

    return { ok: true, content }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "OpenRouter request failed",
    }
  }
}

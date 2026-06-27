import { openrouterChat, type ChatMessage } from "@/lib/openrouter"
import { parseAiJson } from "@/lib/ai/parse-json"
import { XHUMA_AI_SYSTEM } from "@/lib/ai/system-prompt"

export async function aiJsonChat<T>(
  userPrompt: string,
  options?: {
    systemExtra?: string
    temperature?: number
    history?: ChatMessage[]
  },
): Promise<{ data: T | null; raw?: string; error?: string }> {
  const messages: ChatMessage[] = [
    { role: "system", content: `${XHUMA_AI_SYSTEM}\n\n${options?.systemExtra ?? ""}`.trim() },
    ...(options?.history ?? []),
    { role: "user", content: userPrompt },
  ]

  const result = await openrouterChat(messages, { temperature: options?.temperature ?? 0.7 })
  if (!result.ok) return { data: null, error: result.error }

  const data = parseAiJson<T>(result.content)
  return { data, raw: result.content }
}

export async function aiTextChat(
  userPrompt: string,
  options?: { systemExtra?: string; history?: ChatMessage[] },
): Promise<{ text: string | null; error?: string }> {
  const messages: ChatMessage[] = [
    { role: "system", content: `${XHUMA_AI_SYSTEM}\n\n${options?.systemExtra ?? ""}`.trim() },
    ...(options?.history ?? []),
    { role: "user", content: userPrompt },
  ]
  const result = await openrouterChat(messages)
  if (!result.ok) return { text: null, error: result.error }
  return { text: result.content }
}

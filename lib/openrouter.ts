type ChatMessage = { role: "system" | "user"; content: string }

export async function openrouterChat(
  messages: ChatMessage[],
  options?: { temperature?: number },
): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return null

  const model = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-001"

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Xhuma",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
      }),
    })

    if (!res.ok) return null
    const json = await res.json()
    return (json.choices?.[0]?.message?.content as string | undefined)?.trim() ?? null
  } catch {
    return null
  }
}

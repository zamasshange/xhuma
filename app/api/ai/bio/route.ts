import { apiSuccess, apiError } from "@/lib/api-response"

const MOCK_BIOS = [
  "Creator sharing tools, stories, and behind-the-scenes moments.",
  "Building in public. Links to my work, socials, and newsletter below.",
  "Digital maker | Coffee enthusiast | Always shipping something new.",
]

async function generateWithOpenAI(text: string): Promise<string[] | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Generate exactly 3 short link-in-bio descriptions (max 120 chars each). Return JSON array of strings only.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.8,
      }),
    })
    if (!res.ok) return null
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content as string
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed) && parsed.length >= 3) return parsed.slice(0, 3).map(String)
    return null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const text = body.text as string | undefined
  if (!text?.trim()) return apiError("Text is required")

  const ai = await generateWithOpenAI(text)
  const bios = ai ?? MOCK_BIOS.map((b) => `${b} (${text.slice(0, 30)}…)`)

  return apiSuccess({ bios })
}

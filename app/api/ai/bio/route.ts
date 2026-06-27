import { apiSuccess, apiError } from "@/lib/api-response"
import { openrouterChat } from "@/lib/openrouter"

const MOCK_BIOS = [
  "Creator sharing tools, stories, and behind-the-scenes moments.",
  "Building in public. Links to my work, socials, and newsletter below.",
  "Digital maker | Coffee enthusiast | Always shipping something new.",
]

async function generateBios(text: string): Promise<string[] | null> {
  const content = await openrouterChat(
    [
      {
        role: "system",
        content:
          "Generate exactly 3 short link-in-bio descriptions (max 120 chars each). Return JSON array of strings only, no markdown.",
      },
      { role: "user", content: text },
    ],
    { temperature: 0.8 },
  )
  if (!content) return null

  try {
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim())
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

  const ai = await generateBios(text)
  const bios = ai ?? MOCK_BIOS.map((b) => `${b} (${text.slice(0, 30)}…)`)

  return apiSuccess({ bios })
}

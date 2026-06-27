import { apiSuccess, apiError } from "@/lib/api-response"
import { openrouterChat } from "@/lib/openrouter"

const MOCK_LINKS = [
  { title: "Portfolio", url: "https://example.com" },
  { title: "Newsletter", url: "https://example.com/newsletter" },
  { title: "Book a call", url: "https://cal.com" },
  { title: "Latest project", url: "https://github.com" },
]

async function generateLinks(input: string): Promise<typeof MOCK_LINKS | null> {
  const result = await openrouterChat(
    [
      {
        role: "system",
        content:
          'Suggest 4 link-in-bio links as JSON array: [{ "title": string, "url": string }]. Use placeholder URLs. Return JSON only, no markdown.',
      },
      { role: "user", content: input },
    ],
    { temperature: 0.7 },
  )
  if (!result.ok) {
    console.warn("[ai/links]", result.error)
    return null
  }

  try {
    const parsed = JSON.parse(result.content.replace(/```json\n?|\n?```/g, "").trim())
    if (Array.isArray(parsed)) return parsed.slice(0, 4)
    return null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const input = (body.bio ?? body.profession ?? "") as string
  if (!input.trim()) return apiError("Bio or profession is required")

  const ai = await generateLinks(input)
  const links = ai ?? MOCK_LINKS.map((l) => ({ ...l, title: `${l.title} — ${input.slice(0, 20)}` }))

  return apiSuccess({ links })
}

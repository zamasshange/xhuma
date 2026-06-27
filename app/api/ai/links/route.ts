import { apiSuccess, apiError } from "@/lib/api-response"

const MOCK_LINKS = [
  { title: "Portfolio", url: "https://example.com" },
  { title: "Newsletter", url: "https://example.com/newsletter" },
  { title: "Book a call", url: "https://cal.com" },
  { title: "Latest project", url: "https://github.com" },
]

async function generateWithOpenAI(input: string): Promise<typeof MOCK_LINKS | null> {
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
              'Suggest 4 link-in-bio links as JSON array: [{ "title": string, "url": string }]. Use placeholder URLs.',
          },
          { role: "user", content: input },
        ],
        temperature: 0.7,
      }),
    })
    if (!res.ok) return null
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content as string
    const parsed = JSON.parse(content)
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

  const ai = await generateWithOpenAI(input)
  const links = ai ?? MOCK_LINKS.map((l) => ({ ...l, title: `${l.title} — ${input.slice(0, 20)}` }))

  return apiSuccess({ links })
}

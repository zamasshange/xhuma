import { apiSuccess, apiError } from "@/lib/api-response"

const MOCK_MAP: Record<string, string> = {
  instagram: "Follow on Instagram",
  youtube: "Watch on YouTube",
  twitter: "Follow on X",
  tiktok: "TikTok",
  github: "View GitHub",
}

async function generateWithOpenAI(platform: string): Promise<string | null> {
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
            content: "Return a single short, catchy link-in-bio button label (max 40 chars). Plain text only.",
          },
          { role: "user", content: `Platform: ${platform}` },
        ],
        temperature: 0.7,
      }),
    })
    if (!res.ok) return null
    const json = await res.json()
    return (json.choices?.[0]?.message?.content as string)?.trim() ?? null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const platform = (body.platform ?? body.text ?? "") as string
  if (!platform.trim()) return apiError("Platform name is required")

  const key = platform.toLowerCase().trim()
  const ai = await generateWithOpenAI(platform)
  const text = ai ?? MOCK_MAP[key] ?? `Visit my ${platform}`

  return apiSuccess({ text })
}

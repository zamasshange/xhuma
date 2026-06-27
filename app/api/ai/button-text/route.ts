import { apiSuccess, apiError } from "@/lib/api-response"
import { openrouterChat } from "@/lib/openrouter"

const MOCK_MAP: Record<string, string> = {
  instagram: "Follow on Instagram",
  youtube: "Watch on YouTube",
  twitter: "Follow on X",
  tiktok: "TikTok",
  github: "View GitHub",
}

async function generateButtonText(platform: string): Promise<string | null> {
  const result = await openrouterChat(
    [
      {
        role: "system",
        content: "Return a single short, catchy link-in-bio button label (max 40 chars). Plain text only.",
      },
      { role: "user", content: `Platform: ${platform}` },
    ],
    { temperature: 0.7 },
  )
  if (!result.ok) {
    console.warn("[ai/button-text]", result.error)
    return null
  }
  return result.content
}

export async function POST(request: Request) {
  const body = await request.json()
  const platform = (body.platform ?? body.text ?? "") as string
  if (!platform.trim()) return apiError("Platform name is required")

  const key = platform.toLowerCase().trim()
  const ai = await generateButtonText(platform)
  const text = ai ?? MOCK_MAP[key] ?? `Visit my ${platform}`

  return apiSuccess({ text })
}

import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { getRecommendedLinks, inferProfession } from "@/lib/ai/link-recommendations"
import { createSection, pageSectionsFromDocument, BLANK_TEMPLATE_ID } from "@/lib/editor-sections"
import { getMarketplaceTemplate } from "@/lib/templates/catalog"
import type { TemplateDocument } from "@/lib/editor-state"
import { inferLinkIcon } from "@/lib/infer-link-icon"

function mockTemplate(prompt: string): TemplateDocument {
  const profession = inferProfession(prompt)
  const recs = getRecommendedLinks(profession)
  const base = getMarketplaceTemplate(
    /music|dj/.test(prompt.toLowerCase())
      ? "musician"
      : /coffee|shop|business/.test(prompt.toLowerCase())
        ? "business"
        : /dev|code/.test(prompt.toLowerCase())
          ? "developer"
          : "creator",
  )

  const doc = base?.default_data ?? getMarketplaceTemplate("creator")!.default_data
  return {
    ...doc,
    layout: "ai-generated",
    profile: {
      display_name: prompt.split(" ").slice(0, 3).join(" ") || "Your Name",
      bio: `South African creator — ${prompt.slice(0, 120)}`,
      avatar_url: null,
    },
    links: recs.slice(0, 4).map((r, i) => ({
      id: `link-${i}`,
      title: r.title,
      url: r.url,
      icon: r.icon,
      position: i,
      is_active: true,
    })),
    page_sections: [
      createSection("profile"),
      createSection("links"),
      createSection("about", { body: prompt }),
      ...(/service|business|shop/.test(prompt.toLowerCase()) ? [createSection("services")] : []),
    ],
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const prompt = body.prompt as string | undefined
  if (!prompt?.trim()) return apiError("Describe who you are or what you do")

  const { data, error } = await aiJsonChat<{
    template_id: string
    display_name: string
    bio: string
    theme: { bg: string; text: string; button: string; button_text?: string; preset_id?: string }
    links: { title: string; url: string }[]
    sections: string[]
    section_content?: Record<string, Record<string, unknown>>
    message: string
  }>(
    `Generate a complete link-in-bio template for a South African creator: "${prompt}"
Return JSON:
{
  "template_id": "suggested category id",
  "display_name": string,
  "bio": max 200 chars,
  "theme": { "bg", "text", "button", "button_text", "preset_id" },
  "links": [{ "title": "strong CTA", "url": "https://..." }],
  "sections": ["profile","links","about", ...],
  "section_content": { "about": { "body": "..." }, "services": { "items": [] } },
  "message": "one sentence"
}
Prefer WhatsApp for SA businesses.`,
    { temperature: 0.75 },
  )

  if (!data) {
    const doc = mockTemplate(prompt)
    return apiSuccess({
      templateId: BLANK_TEMPLATE_ID,
      name: `AI: ${prompt.slice(0, 40)}`,
      document: doc,
      message: "Template generated with AI suggestions.",
      mock: true,
      aiError: error,
    })
  }

  const pageSections = data.sections.map((s) => {
    const type = s as Parameters<typeof createSection>[0]
    const content = data.section_content?.[s] ?? undefined
    return createSection(type, content)
  })

  const document: TemplateDocument = {
    layout: "ai-generated",
    sections: data.sections,
    page_sections: pageSections,
    theme: {
      bg: data.theme.bg,
      text: data.theme.text,
      button: data.theme.button,
      button_text: data.theme.button_text ?? "#ffffff",
      radius: "14px",
      preset_id: data.theme.preset_id,
    },
    profile: {
      display_name: data.display_name,
      bio: data.bio,
      avatar_url: null,
    },
    links: data.links.map((l, i) => ({
      id: `link-${i}`,
      title: l.title,
      url: l.url,
      icon: inferLinkIcon(l.title, l.url),
      position: i,
      is_active: true,
    })),
  }

  return apiSuccess({
    templateId: BLANK_TEMPLATE_ID,
    name: `AI: ${data.display_name}`,
    document,
    message: data.message,
    mock: false,
  })
}

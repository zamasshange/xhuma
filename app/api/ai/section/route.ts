import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { createSection, defaultSectionContent, type SectionType } from "@/lib/editor-sections"

const VALID_TYPES: SectionType[] = [
  "about",
  "gallery",
  "video",
  "music_embed",
  "services",
  "pricing",
  "testimonials",
  "faq",
  "booking",
  "whatsapp",
  "newsletter",
  "map",
  "donation",
  "events",
  "store_links",
  "contact_form",
]

function mockSection(prompt: string) {
  const p = prompt.toLowerCase()
  let type: SectionType = "about"
  if (/testimonial|review/.test(p)) type = "testimonials"
  else if (/service/.test(p)) type = "services"
  else if (/pric|package/.test(p)) type = "pricing"
  else if (/faq|question/.test(p)) type = "faq"
  else if (/book|appointment/.test(p)) type = "booking"
  else if (/whatsapp|chat/.test(p)) type = "whatsapp"
  else if (/gallery|photo/.test(p)) type = "gallery"
  else if (/video|youtube/.test(p)) type = "video"
  else if (/music|spotify/.test(p)) type = "music_embed"
  else if (/newsletter|email/.test(p)) type = "newsletter"
  else if (/map|location/.test(p)) type = "map"

  return {
    section: createSection(type, defaultSectionContent(type)),
    message: `Added ${type.replace("_", " ")} section.`,
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const prompt = body.prompt as string | undefined
  const theme = body.theme as Record<string, unknown> | undefined

  if (!prompt?.trim()) return apiError("Describe the section you want")

  const { data, error } = await aiJsonChat<{
    type: SectionType
    title: string
    content: Record<string, unknown>
    message: string
  }>(
    `User wants to add a section to their South African link-in-bio page: "${prompt}"
Active theme colours: ${JSON.stringify(theme ?? {})}
Return JSON: { "type": one of ${VALID_TYPES.join("|")}, "title": string, "content": { section-specific fields }, "message": string }
Use ZAR for prices. WhatsApp URLs use wa.me/27.`,
    { temperature: 0.7 },
  )

  if (!data?.type || !VALID_TYPES.includes(data.type)) {
    const mock = mockSection(prompt)
    return apiSuccess({ ...mock, mock: true, aiError: error })
  }

  const section = createSection(data.type, { ...defaultSectionContent(data.type), ...data.content })
  if (data.title) section.title = data.title

  return apiSuccess({
    section,
    message: data.message ?? `Added ${data.title ?? data.type} section.`,
    mock: false,
  })
}

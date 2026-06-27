import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { getRecommendedLinks, inferProfession } from "@/lib/ai/link-recommendations"
import { getThemePreset } from "@/lib/theme-presets"

type OnboardingAnswers = {
  role?: string
  audience?: string
  goal?: string
  platforms?: string[]
  style?: string
  country?: string
}

type OnboardingResult = {
  display_names: string[]
  bio: string
  cta: string
  theme_preset_id: string
  accent_colors: { bg: string; text: string; button: string }
  links: { title: string; url: string }[]
  sections: string[]
  button_labels: string[]
}

function mockOnboarding(answers: OnboardingAnswers): OnboardingResult {
  const role = answers.role ?? "creator"
  const profession = inferProfession(role)
  const recs = getRecommendedLinks(role)
  const style = (answers.style ?? "modern").toLowerCase()

  let preset = "basic"
  if (/luxury|gold|black/.test(style)) preset = "carbon"
  else if (/playful|bright|fun/.test(style)) preset = "strawberry"
  else if (/neon|creative/.test(style)) preset = "neon"
  else if (/minimal|clean/.test(style)) preset = "minimal"
  else if (/professional|blue/.test(style)) preset = "rainy"

  const theme = getThemePreset(preset)?.theme

  return {
    display_names: [
      role.split(" ")[0] ? `${role.split(" ")[0]} SA` : "Your Brand",
      `${role} | ${answers.country ?? "South Africa"}`,
      role.slice(0, 30),
    ],
    bio: `${role} helping ${answers.audience ?? "my community"} — ${answers.goal ?? "grow online"}. Based in ${answers.country ?? "South Africa"}.`,
    cta: "Let's connect",
    theme_preset_id: preset,
    accent_colors: {
      bg: theme?.bg ?? "#ffffff",
      text: theme?.text ?? "#0d0c22",
      button: theme?.button ?? "#0d0c22",
    },
    links: recs.map((r) => ({ title: r.title, url: r.url })),
    sections: ["profile", "links"],
    button_labels: recs.map((r) => r.title),
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const answers = body.answers as OnboardingAnswers | undefined
  if (!answers?.role?.trim()) return apiError("Role is required")

  const { data, error } = await aiJsonChat<OnboardingResult>(
    `Generate a complete link-in-bio setup for a South African creator.
Answers: ${JSON.stringify(answers)}

Return JSON only:
{
  "display_names": [3 name options],
  "bio": "max 200 chars",
  "cta": "primary call-to-action phrase",
  "theme_preset_id": "one of: basic, summer, retro, carbon, neon, minimal, strawberry, rainy, chameleon",
  "accent_colors": { "bg": "#hex", "text": "#hex", "button": "#hex" },
  "links": [{ "title": "action CTA with emoji optional", "url": "https://..." }],
  "sections": ["profile", "links"],
  "button_labels": ["strong CTA labels for links"]
}
Prefer WhatsApp for SA businesses. Use en-ZA spelling.`,
    { temperature: 0.75 },
  )

  const result = data ?? mockOnboarding(answers)
  return apiSuccess({ setup: result, mock: !data, aiError: error })
}

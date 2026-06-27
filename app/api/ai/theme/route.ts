import { apiSuccess, apiError } from "@/lib/api-response"
import { aiJsonChat } from "@/lib/ai/server"
import { getThemePreset } from "@/lib/theme-presets"

const STYLE_PRESETS: Record<string, { bg: string; text: string; button: string; button_text?: string }> = {
  luxury: { bg: "#0a0a0a", text: "#f5e6c8", button: "#c9a227", button_text: "#0a0a0a" },
  minimal: { bg: "#fafafa", text: "#171717", button: "#171717", button_text: "#ffffff" },
  playful: { bg: "#fef3c7", text: "#78350f", button: "#f59e0b", button_text: "#ffffff" },
  professional: { bg: "#0f172a", text: "#e2e8f0", button: "#2563eb", button_text: "#ffffff" },
  neon: { bg: "#1e0a3c", text: "#ffffff", button: "#a855f7" },
}

type ThemeResult = {
  bg: string
  text: string
  button: string
  button_text?: string
  radius?: string
  preset_id?: string
  explanation?: string
}

function mockTheme(prompt: string): ThemeResult {
  const p = prompt.toLowerCase()
  if (/luxury|gold|black/.test(p)) return { ...STYLE_PRESETS.luxury, preset_id: "carbon" }
  if (/minimal|clean/.test(p)) return { ...STYLE_PRESETS.minimal, preset_id: "minimal" }
  if (/playful|bright/.test(p)) return { ...STYLE_PRESETS.playful, preset_id: "strawberry" }
  if (/neon|creative/.test(p)) return { ...STYLE_PRESETS.neon, preset_id: "neon" }
  if (/professional|blue/.test(p)) return { ...STYLE_PRESETS.professional, preset_id: "rainy" }
  return { ...STYLE_PRESETS.minimal, preset_id: "basic" }
}

export async function POST(request: Request) {
  const body = await request.json()
  const prompt = body.prompt as string | undefined
  if (!prompt?.trim()) return apiError("Describe your desired look")

  const { data, error } = await aiJsonChat<ThemeResult>(
    `User wants their link-in-bio page to feel like: "${prompt}"
Return JSON with hex colours matching Xhuma's design system:
{ "bg": "#hex", "text": "#hex", "button": "#hex", "button_text": "#hex", "radius": "14px", "preset_id": "optional preset id", "explanation": "one sentence" }
Ensure readable contrast. South African creator context.`,
    { temperature: 0.6 },
  )

  const theme: ThemeResult = data ?? mockTheme(prompt)
  if (theme.preset_id) {
    const preset = getThemePreset(theme.preset_id)
    if (preset) {
      return apiSuccess({
        theme: { ...preset.theme, ...theme },
        explanation: theme.explanation ?? `Applied a ${theme.preset_id} palette.`,
        mock: !data,
        aiError: error,
      })
    }
  }

  return apiSuccess({
    theme: { ...theme, radius: theme.radius ?? "14px" },
    explanation: theme.explanation ?? "Custom palette applied.",
    mock: !data,
    aiError: error,
  })
}

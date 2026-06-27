/** Extract and parse JSON from model output */
export function parseAiJson<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim()
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}

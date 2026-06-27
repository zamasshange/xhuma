/** Ensure URLs have a protocol for validation and storage */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, "")}`
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url))
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

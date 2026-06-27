/** Ensure URLs have a protocol for validation and storage */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^(https?|mailto|tel):/i.test(trimmed)) return trimmed
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

/** http(s), mailto, and tel links are allowed on profiles */
export function isValidLinkUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (/^mailto:/i.test(trimmed)) return trimmed.length > 7
  if (/^tel:/i.test(trimmed)) return trimmed.length > 4
  return isValidHttpUrl(trimmed)
}

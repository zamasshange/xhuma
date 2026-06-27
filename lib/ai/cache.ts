const PREFIX = "xhuma-ai:"

export function getAiCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { exp, data } = JSON.parse(raw) as { exp: number; data: T }
    if (Date.now() > exp) {
      sessionStorage.removeItem(PREFIX + key)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function setAiCache<T>(key: string, data: T, ttlMs = 15 * 60 * 1000) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(
      PREFIX + key,
      JSON.stringify({ exp: Date.now() + ttlMs, data }),
    )
  } catch {
    /* quota */
  }
}

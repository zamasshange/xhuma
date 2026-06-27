import { getUserId } from "@/lib/temp-user"

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const userId = typeof window !== "undefined" ? getUserId() : ""
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(userId ? { "X-User-Id": userId } : {}),
        ...options?.headers,
      },
    })

    const text = await res.text()
    if (!text) {
      return { success: false, error: `Empty response (${res.status})` }
    }

    try {
      return JSON.parse(text) as { success: boolean; data?: T; error?: string }
    } catch {
      return { success: false, error: `Invalid response (${res.status})` }
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}

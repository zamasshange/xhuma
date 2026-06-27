import { getClientUserId } from "@/lib/client-auth"

type ClerkWindow = Window & {
  Clerk?: {
    user?: { id: string } | null
    session?: { getToken: () => Promise<string | null> }
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {}
  if (typeof window === "undefined") return headers

  const clerk = (window as ClerkWindow).Clerk
  const token = await clerk?.session?.getToken?.()
  if (token) headers.Authorization = `Bearer ${token}`

  const userId = getClientUserId()
  if (userId) headers["X-User-Id"] = userId

  return headers
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const isFormData = options?.body instanceof FormData
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(await authHeaders()),
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

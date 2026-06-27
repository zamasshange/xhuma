import { getUserId as getAnonUserId } from "@/lib/temp-user"

type ClerkWindow = Window & { Clerk?: { user?: { id: string } | null } }

/** Prefer signed-in Clerk user; fall back to anonymous draft session id */
export function getClientUserId(): string {
  if (typeof window === "undefined") return ""
  const clerkId = (window as ClerkWindow).Clerk?.user?.id
  if (clerkId) return clerkId
  return getAnonUserId()
}

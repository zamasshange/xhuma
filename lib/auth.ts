import { auth } from "@clerk/nextjs/server"

/** Server: Clerk user id, or anonymous draft id from header */
export async function getAuthUserId(request: Request): Promise<string | null> {
  const { userId } = await auth()
  if (userId) return userId
  return request.headers.get("x-user-id")?.trim() || null
}

export async function requireAuthUserId(request: Request): Promise<string | { error: string }> {
  const id = await getAuthUserId(request)
  if (!id) return { error: "Unauthorized" }
  return id
}

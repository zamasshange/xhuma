const STORAGE_KEY = "user_id"

export function getUserId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function setUserId(id: string) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id)
}

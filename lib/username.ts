export function sanitizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
}

export function displayNameFromUsername(username: string): string {
  return username
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function isValidUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20 && /^[a-z0-9_-]+$/.test(username)
}

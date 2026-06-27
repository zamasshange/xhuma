import { revalidateTag } from "next/cache"

export function revalidatePublicProfile(username: string) {
  revalidateTag(`profile-${username.toLowerCase()}`)
}

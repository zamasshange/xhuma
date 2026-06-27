import { defaultProfile, getProfile, profiles } from "@/data/profiles"
import type { Profile } from "@/lib/types"

export interface ProfileService {
  getByUsername(username: string): Profile | undefined
  getAll(): Profile[]
  getCurrentUser(): Profile
}

export const profileService: ProfileService = {
  getByUsername: (username) => getProfile(username),
  getAll: () => profiles,
  getCurrentUser: () => defaultProfile,
}

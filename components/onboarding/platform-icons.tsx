import type { OnboardingPlatform } from "@/data/onboarding"
import { SocialIconBadge } from "@/components/icons/social-icon"

export function PlatformIcon({ name }: { name: OnboardingPlatform["icon"] }) {
  return <SocialIconBadge icon={name} size={36} className="rounded-xl" />
}

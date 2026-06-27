export type ProfileViewDensity = "full" | "device" | "compact"

/** Resolve density — `compact` prop maps to the smallest tier for backwards compatibility */
export function resolveProfileDensity(
  density?: ProfileViewDensity,
  compact?: boolean,
): ProfileViewDensity {
  if (density) return density
  if (compact) return "compact"
  return "full"
}

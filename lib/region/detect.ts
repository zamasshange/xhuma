import { cookies, headers } from "next/headers"
import {
  DEFAULT_REGION,
  getRegionConfig,
  regionFromCountryCode,
  type RegionCode,
  type RegionConfig,
} from "@/lib/region/config"

const REGION_COOKIE = "xhuma-region"

export function parseRegionCookie(value: string | null | undefined): RegionCode | null {
  if (value === "ZA" || value === "US") return value
  return null
}

/** Detect region on the server from cookie, then geo headers */
export async function detectRegion(): Promise<RegionCode> {
  const cookieStore = await cookies()
  const fromCookie = parseRegionCookie(cookieStore.get(REGION_COOKIE)?.value)
  if (fromCookie) return fromCookie

  const headerStore = await headers()
  const country =
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    headerStore.get("x-country-code")

  return regionFromCountryCode(country)
}

export async function detectRegionConfig(): Promise<RegionConfig> {
  return getRegionConfig(await detectRegion())
}

export { REGION_COOKIE }

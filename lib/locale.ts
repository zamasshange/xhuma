import type { RegionConfig } from "@/lib/region/config"
import { getRegionConfig, DEFAULT_REGION } from "@/lib/region/config"

/** @deprecated Use getRegionConfig() or useRegion() */
export const DEFAULT_LOCALE = "en-ZA" as const
/** @deprecated Use getRegionConfig() or useRegion() */
export const DEFAULT_TIMEZONE = "Africa/Johannesburg"
/** @deprecated Use getRegionConfig() or useRegion() */
export const CURRENCY_CODE = "ZAR"
/** @deprecated Use getRegionConfig() or useRegion() */
export const CURRENCY_SYMBOL = "R"

/** @deprecated Use getRegionConfig("ZA").phoneExample */
export const SA_PHONE_EXAMPLES = {
  mobile: "+27 82 123 4567",
  mobileAlt: "+27 71 555 1234",
} as const

/** @deprecated Use getRegionConfig("ZA").cities */
export const SA_CITIES = getRegionConfig("ZA").cities

export function formatCurrency(
  amount: number,
  region: RegionConfig | RegionConfig["code"] = DEFAULT_REGION,
  options?: { decimals?: boolean; suffix?: string },
): string {
  const config = typeof region === "string" ? getRegionConfig(region) : region
  if (amount === 0) return "Free"
  const formatted = amount.toLocaleString(config.locale, {
    minimumFractionDigits: options?.decimals ? 2 : 0,
    maximumFractionDigits: options?.decimals ? 2 : 0,
  })
  const base =
    config.currency.code === "USD"
      ? `${config.currency.symbol}${formatted}`
      : `${config.currency.symbol}${formatted}`
  return options?.suffix ? `${base}${options.suffix}` : base
}

export function formatPriceMonthly(
  amount: number,
  region: RegionConfig | RegionConfig["code"] = DEFAULT_REGION,
  annual = false,
): string {
  if (amount === 0) return "Free"
  return `${formatCurrency(amount, region)}/${annual ? "month, billed annually" : "month"}`
}

export function formatDateLong(
  value: Date | string,
  region: RegionConfig | RegionConfig["code"] = DEFAULT_REGION,
): string {
  const config = typeof region === "string" ? getRegionConfig(region) : region
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString(config.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: config.timezone,
  })
}

export function formatDateShort(
  value: Date | string,
  region: RegionConfig | RegionConfig["code"] = DEFAULT_REGION,
): string {
  const config = typeof region === "string" ? getRegionConfig(region) : region
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString(config.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: config.timezone,
  })
}

export function formatNumber(
  value: number,
  region: RegionConfig | RegionConfig["code"] = DEFAULT_REGION,
): string {
  const config = typeof region === "string" ? getRegionConfig(region) : region
  return value.toLocaleString(config.locale)
}

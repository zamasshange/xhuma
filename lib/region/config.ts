export type RegionCode = "ZA" | "US"

export type RegionConfig = {
  code: RegionCode
  locale: string
  timezone: string
  currency: { code: string; symbol: string }
  cities: readonly string[]
  phoneExample: string
  pricing: { monthly: number; yearly: number }
  comparisonPrices: readonly number[]
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  ZA: {
    code: "ZA",
    locale: "en-ZA",
    timezone: "Africa/Johannesburg",
    currency: { code: "ZAR", symbol: "R" },
    cities: [
      "Johannesburg",
      "Cape Town",
      "Durban",
      "Pretoria",
      "Gqeberha",
      "Bloemfontein",
      "Polokwane",
      "Mbombela",
      "Soweto",
      "Midrand",
    ],
    phoneExample: "+27 82 123 4567",
    pricing: { monthly: 99, yearly: 49 },
    comparisonPrices: [149, 199, 139, 99, 149, 99],
  },
  US: {
    code: "US",
    locale: "en-US",
    timezone: "America/New_York",
    currency: { code: "USD", symbol: "$" },
    cities: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Miami",
      "San Francisco",
      "Austin",
      "Seattle",
      "Boston",
      "Atlanta",
    ],
    phoneExample: "+1 (555) 123-4567",
    pricing: { monthly: 14, yearly: 7 },
    comparisonPrices: [15, 20, 14, 10, 15, 10],
  },
}

export const DEFAULT_REGION: RegionCode = "ZA"

export function getRegionConfig(code: RegionCode = DEFAULT_REGION): RegionConfig {
  return REGIONS[code] ?? REGIONS.ZA
}

/** Map an ISO country code to a supported region */
export function regionFromCountryCode(country: string | null | undefined): RegionCode {
  if (!country) return DEFAULT_REGION
  const code = country.toUpperCase()
  if (code === "US") return "US"
  if (code === "ZA") return "ZA"
  const southernAfrica = new Set(["BW", "NA", "LS", "SZ", "MZ", "ZW", "ZM", "MW"])
  if (southernAfrica.has(code)) return "ZA"
  return DEFAULT_REGION
}

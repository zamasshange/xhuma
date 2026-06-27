/** South African locale defaults for Xhuma */

export const DEFAULT_LOCALE = "en-ZA" as const
export const DEFAULT_TIMEZONE = "Africa/Johannesburg"
export const CURRENCY_CODE = "ZAR"
export const CURRENCY_SYMBOL = "R"

/** Example SA phone numbers for placeholders and mock data */
export const SA_PHONE_EXAMPLES = {
  mobile: "+27 82 123 4567",
  mobileAlt: "+27 71 555 1234",
} as const

/** Example SA cities for mock data */
export const SA_CITIES = [
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
] as const

export function formatCurrency(
  amount: number,
  options?: { decimals?: boolean; suffix?: string },
): string {
  if (amount === 0) return "Free"
  const formatted = amount.toLocaleString(DEFAULT_LOCALE, {
    minimumFractionDigits: options?.decimals ? 2 : 0,
    maximumFractionDigits: options?.decimals ? 2 : 0,
  })
  const base = `${CURRENCY_SYMBOL}${formatted}`
  return options?.suffix ? `${base}${options.suffix}` : base
}

export function formatPriceMonthly(amount: number, annual = false): string {
  if (amount === 0) return "Free"
  return `${formatCurrency(amount)}/${annual ? "month, billed annually" : "month"}`
}

/** Long date: 27 June 2026 */
export function formatDateLong(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DEFAULT_TIMEZONE,
  })
}

/** Short date: 27/06/2026 */
export function formatDateShort(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: DEFAULT_TIMEZONE,
  })
}

export function formatNumber(value: number): string {
  return value.toLocaleString(DEFAULT_LOCALE)
}

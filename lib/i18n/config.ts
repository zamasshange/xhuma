/**
 * i18n configuration — English (South Africa) is the default.
 * Additional official languages are listed for future translation support.
 * Translations are not implemented yet; use this module when adding locale switching.
 */

export const SUPPORTED_LOCALES = [
  "en-ZA",
  "zu-ZA",
  "xh-ZA",
  "af-ZA",
  "st-ZA",
  "tn-ZA",
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = "en-ZA"

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  "en-ZA": "English (South Africa)",
  "zu-ZA": "isiZulu",
  "xh-ZA": "isiXhosa",
  "af-ZA": "Afrikaans",
  "st-ZA": "Sesotho",
  "tn-ZA": "Setswana",
}

export const LOCALE_HTML_LANG: Record<SupportedLocale, string> = {
  "en-ZA": "en-ZA",
  "zu-ZA": "zu",
  "xh-ZA": "xh",
  "af-ZA": "af",
  "st-ZA": "st",
  "tn-ZA": "tn",
}

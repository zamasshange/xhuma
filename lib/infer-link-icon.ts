export type SocialIconName =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "spotify"
  | "x"
  | "twitter"
  | "facebook"
  | "snapchat"
  | "linkedin"
  | "github"
  | "whatsapp"
  | "coffee"
  | "buymeacoffee"
  | "website"
  | "globe"
  | "link"

type IconRule = { icon: SocialIconName; patterns: RegExp[] }

const RULES: IconRule[] = [
  { icon: "instagram", patterns: [/instagram/i, /instagr\.am/i] },
  { icon: "tiktok", patterns: [/tiktok/i] },
  { icon: "youtube", patterns: [/youtube/i, /youtu\.be/i] },
  { icon: "spotify", patterns: [/spotify/i, /open\.spotify/i] },
  { icon: "x", patterns: [/^x$/i, /twitter/i, /\bx\.com\b/i] },
  { icon: "facebook", patterns: [/facebook/i, /fb\.com/i] },
  { icon: "snapchat", patterns: [/snapchat/i] },
  { icon: "linkedin", patterns: [/linkedin/i] },
  { icon: "github", patterns: [/github/i] },
  { icon: "whatsapp", patterns: [/whatsapp/i, /wa\.me/i] },
  { icon: "buymeacoffee", patterns: [/buy\s*me\s*a\s*coffee/i, /buymeacoffee/i] },
  { icon: "coffee", patterns: [/coffee/i, /ko-?fi/i] },
  { icon: "website", patterns: [/website/i, /my\s*site/i, /portfolio/i, /blog/i] },
]

function matchesAny(text: string, patterns: RegExp[]) {
  return patterns.some((p) => p.test(text))
}

/** Guess platform icon from link title and/or URL */
export function inferLinkIcon(title?: string | null, url?: string | null): SocialIconName | null {
  const haystack = `${title ?? ""} ${url ?? ""}`.trim()
  if (!haystack) return null

  for (const rule of RULES) {
    if (matchesAny(haystack, rule.patterns)) return rule.icon
  }

  if (url && /^mailto:/i.test(url)) return "link"
  if (url && /^https?:\/\//i.test(url) && !matchesAny(haystack, [/instagram|youtube|tiktok|spotify|twitter|facebook/i])) {
    return "website"
  }

  return null
}

export const aiBios = {
  professional:
    "Award-winning music producer crafting cinematic, emotionally-driven soundscapes for artists and brands worldwide. Specializing in modern pop, electronic, and ambient production with a focus on warmth and clarity.",
  friendly:
    "Hey! I'm Aria — I make the kind of music you'd want playing on a late-night drive. Producer, DJ, and full-time studio gremlin. Let's create something we'll both be proud of.",
  creator:
    "Turning feelings into frequencies. 🎧 Producer + DJ. New EP out now. Booking 2026 shows. Tap below to listen, book, or grab my sample packs.",
}

export const aiThemes = [
  { name: "Neon Future", colors: ["#7c5cff", "#4f7cff", "#16121f"], description: "Deep space black with electric violet-to-blue glows and glassy cards." },
  { name: "Soft Aurora", colors: ["#a78bfa", "#60a5fa", "#1e1b2e"], description: "Dreamy pastel gradients with gentle motion and frosted surfaces." },
  { name: "Midnight Mono", colors: ["#6366f1", "#1f2937", "#0b0b12"], description: "Minimal, high-contrast and editorial — pure focus on your links." },
]

export const aiLinkSuggestions: Record<string, { icon: string; title: string }[]> = {
  default: [
    { icon: "instagram", title: "Instagram" },
    { icon: "youtube", title: "YouTube" },
    { icon: "globe", title: "Website" },
    { icon: "mail", title: "Newsletter" },
  ],
  musician: [
    { icon: "music", title: "Spotify" },
    { icon: "music", title: "Apple Music" },
    { icon: "calendar", title: "Booking" },
    { icon: "shopping-bag", title: "Merch Store" },
    { icon: "instagram", title: "Instagram" },
    { icon: "video", title: "TikTok" },
    { icon: "youtube", title: "YouTube" },
    { icon: "globe", title: "Website" },
  ],
  developer: [
    { icon: "github", title: "GitHub" },
    { icon: "book-open", title: "Blog" },
    { icon: "graduation-cap", title: "Courses" },
    { icon: "mail", title: "Newsletter" },
    { icon: "linkedin", title: "LinkedIn" },
    { icon: "globe", title: "Portfolio" },
  ],
  photographer: [
    { icon: "camera", title: "Print Shop" },
    { icon: "instagram", title: "Instagram" },
    { icon: "calendar", title: "Book a shoot" },
    { icon: "image", title: "Portfolio" },
    { icon: "globe", title: "Website" },
  ],
}

export const aiButtonCopy: Record<string, string[]> = {
  default: ["Check this out", "Tap to explore", "See more"],
  instagram: ["Follow my journey", "See my latest content", "Let's connect on IG"],
  spotify: ["Stream my new release", "Add me to your playlist", "Listen now"],
  shop: ["Shop the collection", "Grab yours before they're gone", "Browse the store"],
}

export const aiProfileReview = {
  seoScore: 82,
  creatorScore: 91,
  professionalScore: 76,
  strengths: [
    "Clear, benefit-driven headline that states what you do",
    "Strong primary call-to-action pinned to the top",
    "Consistent visual identity across links and gallery",
  ],
  weaknesses: [
    "Bio is slightly long — trim to under 160 characters for mobile",
    "Two links point to the same destination",
    "Missing a newsletter capture to grow owned audience",
  ],
  suggestions: [
    "Add a single, irresistible lead-magnet link near the top",
    "Use action verbs on every button (Listen, Book, Shop)",
    "Pin your highest-converting link and archive the rest monthly",
  ],
}

export const aiBrandIdentity = {
  colors: ["#7c5cff", "#4f7cff", "#16121f", "#f5f3ff"],
  typography: { heading: "Geist (Bold)", body: "Geist (Regular)" },
  voice: ["Warm", "Confident", "Effortless", "Inspiring"],
  personality: "The Creator — imaginative, expressive, and driven to bring new things into the world.",
  audience: "Music lovers aged 18–34 who value craft, late-night energy, and authentic artistry.",
  keywords: ["cinematic", "analog warmth", "late-night", "handcrafted", "immersive"],
}

export const aiTools = [
  { id: "bio", icon: "pen-line", title: "AI Bio Generator", description: "Generate three on-brand bios in seconds." },
  { id: "theme", icon: "palette", title: "AI Theme Generator", description: "Describe a vibe, get a ready-to-apply theme." },
  { id: "links", icon: "link", title: "AI Link Suggestions", description: "Smart link ideas tailored to your profession." },
  { id: "button", icon: "type", title: "AI Button Writer", description: "Punchy, high-converting button copy." },
  { id: "review", icon: "scan-line", title: "AI Profile Review", description: "A full audit of your page with scores." },
  { id: "brand", icon: "gem", title: "AI Brand Identity", description: "Colors, voice, and personality for your brand." },
]

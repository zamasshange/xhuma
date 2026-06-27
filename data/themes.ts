export const themePresets = [
  { id: "aurora", name: "Aurora", accent: "#7c5cff", preview: "from-violet-600/40 via-blue-600/20 to-background" },
  { id: "midnight", name: "Midnight", accent: "#4f7cff", preview: "from-blue-900/50 via-slate-900/30 to-background" },
  { id: "sunset", name: "Sunset", accent: "#9b5cff", preview: "from-purple-600/40 via-pink-500/20 to-background" },
  { id: "forest", name: "Forest", accent: "#22c55e", preview: "from-emerald-600/30 via-teal-600/20 to-background" },
  { id: "mono", name: "Mono", accent: "#6366f1", preview: "from-slate-700/40 via-slate-800/30 to-background" },
  { id: "coral", name: "Coral", accent: "#f97316", preview: "from-orange-500/40 via-rose-500/20 to-background" },
]

export const fontOptions = [
  { id: "sans", label: "Geist Sans", sample: "Clean & modern" },
  { id: "serif", label: "Serif", sample: "Editorial & elegant" },
  { id: "mono", label: "Geist Mono", sample: "Technical & sharp" },
] as const

export const buttonStyles = ["solid", "outline", "soft", "glass"] as const
export const buttonRadii = ["sm", "md", "lg", "full"] as const
export const avatarShapes = ["circle", "rounded", "square"] as const
export const backgroundTypes = ["gradient", "solid", "mesh"] as const

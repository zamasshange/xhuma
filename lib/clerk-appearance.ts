import type { Appearance } from "@clerk/types"

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#0d0c22",
    colorText: "#0d0c22",
    colorTextSecondary: "#6b6b7b",
    colorBackground: "#ffffff",
    borderRadius: "1rem",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "rounded-3xl shadow-[0_4px_24px_rgba(13,12,34,0.08)] ring-1 ring-black/[0.04]",
    headerTitle: "text-xl font-semibold tracking-tight",
    headerSubtitle: "text-bio-grey",
    formButtonPrimary:
      "bg-bio-dark hover:bg-bio-dark/85 text-white font-semibold rounded-full normal-case shadow-none",
    formFieldInput: "rounded-2xl border-2 border-bio-dark/10",
    footerActionLink: "text-bio-dark font-semibold hover:text-bio-dark/80",
    socialButtonsBlockButton: "rounded-full border-2 border-bio-dark/10 font-semibold",
  },
}

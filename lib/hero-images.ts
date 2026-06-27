import type { StaticImageData } from "next/image"
import hero1 from "@/lib/images/hero1.png"
import hero2 from "@/lib/images/hero2.png"
import hero3 from "@/lib/images/hero3.png"

export type HeroMockup = {
  id: string
  src: StaticImageData
  alt: string
}

/** HD 3D phone mockups for the marketing hero */
export const HERO_MOCKUPS: HeroMockup[] = [
  {
    id: "lerato",
    src: hero1,
    alt: "Xhuma link-in-bio page for a Cape Town photographer on iPhone",
  },
  {
    id: "glam",
    src: hero2,
    alt: "Xhuma link-in-bio page for a beauty creator on iPhone",
  },
  {
    id: "jordan",
    src: hero3,
    alt: "Xhuma link-in-bio page with AI assistant on iPhone",
  },
]

export const heroImage1 = hero1
export const heroImage2 = hero2
export const heroImage3 = hero3

import type { Profile } from "@/lib/types"

export const profiles: Profile[] = [
  {
    username: "ariastone",
    displayName: "Aria Stone",
    headline: "Music Producer & DJ",
    bio: "Crafting late-night soundscapes and warm analog beats. Booking shows worldwide for 2026. Let's make something unforgettable.",
    occupation: "Music Producer",
    pronouns: "she/her",
    location: "Los Angeles, CA",
    website: "ariastone.fm",
    email: "hi@ariastone.fm",
    phone: "+1 (555) 012-3344",
    avatar: "/images/avatars/aria.png",
    verified: true,
    category: "Musicians",
    socials: [
      { platform: "instagram", url: "#" },
      { platform: "youtube", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "spotify", url: "#" },
    ],
    links: [
      { id: "l1", title: "Listen to my new EP", description: "Out now on all platforms", url: "#", icon: "music", visible: true, pinned: true, clicks: 4820 },
      { id: "l2", title: "Book me for your event", description: "Weddings, clubs & festivals", url: "#", icon: "calendar", visible: true, clicks: 1290 },
      { id: "l3", title: "Sample pack — Midnight Vol.2", url: "#", icon: "shopping-bag", visible: true, clicks: 2310 },
      { id: "l4", title: "Behind the scenes on YouTube", url: "#", icon: "youtube", visible: true, clicks: 980 },
    ],
    gallery: [
      { id: "g1", src: "/images/gallery/studio.png", alt: "Studio session" },
      { id: "g2", src: "/images/gallery/stage.png", alt: "Live on stage" },
      { id: "g3", src: "/images/gallery/desk.png", alt: "Production desk" },
    ],
    services: [
      { id: "s1", title: "Custom Beat Production", description: "A bespoke track built around your vision.", price: "From $850" },
      { id: "s2", title: "Mixing & Mastering", description: "Radio-ready polish for your record.", price: "From $300" },
    ],
    testimonials: [
      { id: "t1", name: "Jordan Reese", role: "Recording Artist", avatar: "/images/avatars/leo.png", quote: "Aria turned my rough demo into a chart-ready single. Pure magic." },
    ],
    spotifyEmbed: "Midnight — Aria Stone",
    youtubeEmbed: "Studio Diaries Ep. 04",
    theme: {
      preset: "Aurora",
      accent: "#7c5cff",
      background: "gradient",
      buttonStyle: "glass",
      buttonRadius: "lg",
      font: "sans",
      avatarShape: "circle",
    },
  },
  {
    username: "mayadev",
    displayName: "Maya Chen",
    headline: "Full-Stack Engineer & Educator",
    bio: "I build delightful web apps and teach 200k+ developers how to ship faster. Currently writing about AI tooling.",
    occupation: "Software Engineer",
    pronouns: "she/her",
    location: "Berlin, DE",
    website: "mayachen.dev",
    email: "maya@mayachen.dev",
    avatar: "/images/avatars/maya.png",
    verified: true,
    category: "Developers",
    socials: [
      { platform: "github", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "linkedin", url: "#" },
      { platform: "youtube", url: "#" },
    ],
    links: [
      { id: "l1", title: "Read my engineering blog", description: "Weekly deep dives", url: "#", icon: "book-open", visible: true, pinned: true, clicks: 6210 },
      { id: "l2", title: "Free course: Ship in 7 days", url: "#", icon: "graduation-cap", visible: true, clicks: 3420 },
      { id: "l3", title: "My open-source projects", url: "#", icon: "github", visible: true, clicks: 2890 },
      { id: "l4", title: "Newsletter — 42k subscribers", url: "#", icon: "mail", visible: true, clicks: 1750 },
    ],
    gallery: [
      { id: "g1", src: "/images/gallery/desk.png", alt: "Coding setup" },
    ],
    services: [
      { id: "s1", title: "1:1 Mentorship", description: "Level up your career in 60 minutes.", price: "$180/hr" },
    ],
    testimonials: [
      { id: "t1", name: "Sam Okafor", role: "Junior Dev", avatar: "/images/avatars/noah.png", quote: "Maya's mentorship landed me my first senior role. Worth every minute." },
    ],
    youtubeEmbed: "Build a SaaS in a weekend",
    theme: {
      preset: "Midnight",
      accent: "#4f7cff",
      background: "mesh",
      buttonStyle: "soft",
      buttonRadius: "md",
      font: "mono",
      avatarShape: "rounded",
    },
  },
  {
    username: "leoart",
    displayName: "Leo Martins",
    headline: "Visual Artist & Illustrator",
    bio: "Painting dreams in bold color. Commissions open. Prints available worldwide.",
    occupation: "Illustrator",
    location: "Lisbon, PT",
    website: "leomartins.art",
    email: "studio@leomartins.art",
    avatar: "/images/avatars/leo.png",
    verified: false,
    category: "Artists",
    socials: [
      { platform: "instagram", url: "#" },
      { platform: "tiktok", url: "#" },
      { platform: "twitter", url: "#" },
    ],
    links: [
      { id: "l1", title: "Shop original prints", url: "#", icon: "shopping-bag", visible: true, pinned: true, clicks: 3120 },
      { id: "l2", title: "Commission a piece", url: "#", icon: "palette", visible: true, clicks: 1420 },
      { id: "l3", title: "Behind the canvas", url: "#", icon: "instagram", visible: true, clicks: 2010 },
    ],
    gallery: [
      { id: "g1", src: "/images/gallery/stage.png", alt: "Artwork" },
      { id: "g2", src: "/images/gallery/studio.png", alt: "Studio" },
    ],
    services: [
      { id: "s1", title: "Custom Portrait", description: "Hand-painted, A2, framed.", price: "From $640" },
    ],
    testimonials: [],
    theme: {
      preset: "Sunset",
      accent: "#9b5cff",
      background: "gradient",
      buttonStyle: "solid",
      buttonRadius: "full",
      font: "serif",
      avatarShape: "circle",
    },
  },
]

export function getProfile(username: string): Profile | undefined {
  return profiles.find((p) => p.username === username.toLowerCase())
}

export const defaultProfile = profiles[0]

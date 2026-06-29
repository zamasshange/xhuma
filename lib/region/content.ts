import type { RegionCode } from "@/lib/region/config"
import { getRegionConfig } from "@/lib/region/config"
import {
  bioComparison,
  bioCreators,
  bioPricing,
  bioTestimonials,
  type BioTestimonial,
  BIO_ASSETS,
} from "@/data/bio-link"

export function getRegionalPricing(region: RegionCode) {
  const config = getRegionConfig(region)
  return {
    monthly: config.pricing.monthly,
    yearly: config.pricing.yearly,
    features: bioPricing.features,
  }
}

export function getRegionalComparison(region: RegionCode) {
  const config = getRegionConfig(region)
  return bioComparison.map((item, index) => ({
    ...item,
    price: config.comparisonPrices[index] ?? item.price,
  }))
}

const US_CREATORS = [
  { name: "Maya Chen", username: "mayastudio", image: `${BIO_ASSETS}/user1.Ba8DzGMp.png` },
  { name: "Jordan Lee", username: "jordanbeats", image: `${BIO_ASSETS}/user2.CiMA-Ti0.png` },
  { name: "Sofia Rivera", username: "sofiarivera", image: `${BIO_ASSETS}/user3.w1PRNQjx.png` },
  { name: "Brooklyn Bakes", username: "brooklynbakes", image: `${BIO_ASSETS}/user4.Bo0FbbWl.png` },
  { name: "Nina Beauty", username: "ninabeauty", image: `${BIO_ASSETS}/user5.CwX5k9hm.png` },
  { name: "Alex Codes", username: "alexcodes", image: `${BIO_ASSETS}/user6.BtYp0XeA.png` },
  { name: "Zoe Fashion", username: "zoestyle", image: `${BIO_ASSETS}/user7.BJbxwnbs.png` },
  { name: "Miami Surf Co.", username: "miamisurf", image: `${BIO_ASSETS}/user8.C6dud4fg.png` },
  { name: "Amara Art", username: "amaraart", image: `${BIO_ASSETS}/user9.BTGRzHLW.png` },
  { name: "Chicago Podcast", username: "chi_podcast", image: `${BIO_ASSETS}/user10.Dzm4B_2D.png` },
  { name: "LA Kitchen", username: "lakitchen", image: `${BIO_ASSETS}/user11.R_TCStqE.png` },
  { name: "Austin Tech", username: "austintech", image: `${BIO_ASSETS}/user12.ZeT4kErD.png` },
  { name: "Seattle Fitness", username: "seafitness", image: `${BIO_ASSETS}/user13.CkAwBvvN.png` },
  { name: "Boston Events", username: "bostonevents", image: `${BIO_ASSETS}/user14.BM45zxPw.png` },
]

const US_TESTIMONIALS: BioTestimonial[] = [
  {
    id: "us-1",
    name: "Maya C",
    location: "New York",
    headline: "Freedom like no other",
    body: "I love the freedom Xhuma gives me. I can customize my page exactly how I want, add my links, and even use AI to engage with my audience. It's the best link-in-bio tool I've ever used.",
    avatar: `${BIO_ASSETS}/user1.Ba8DzGMp.png`,
  },
  {
    id: "us-2",
    name: "Jordan L",
    location: "Los Angeles",
    headline: "Awesome service, fair price, very fast",
    body: "I was looking for a link-in-bio tool that was easy to use and affordable. Xhuma exceeded my expectations. The setup was quick, and the AI assistant is a game-changer for my gigs.",
    initials: "JL",
    avatarColor: "#a855f7",
  },
  {
    id: "us-3",
    name: "Sofia R",
    location: "Chicago",
    headline: "My go-to for everything",
    body: "From links to email capture to AI chat — it's all here. I cancelled three other subscriptions after switching. My page looks professional and converts better than ever.",
    initials: "SR",
    avatarColor: "#ec4899",
  },
  {
    id: "us-4",
    name: "Tyler P",
    location: "Houston",
    headline: "Finally, one tool that does it all",
    body: "I used to juggle Linktree, Mailchimp, and a separate analytics tool. Xhuma replaced all of them. The themes are beautiful and my followers love the AI assistant.",
    avatar: `${BIO_ASSETS}/user2.CiMA-Ti0.png`,
  },
  {
    id: "us-5",
    name: "Nina K",
    location: "Miami",
    headline: "Worth every dollar",
    body: "The yearly plan is a steal. Custom domain, unlimited visitors, and the AI actually answers questions about my courses. Support responded within hours when I had a domain question.",
    avatar: `${BIO_ASSETS}/user3.w1PRNQjx.png`,
  },
  {
    id: "us-6",
    name: "Amara Z",
    location: "San Francisco",
    headline: "Creators, this is it",
    body: "As a musician I needed streaming links, tour dates, and merch in one place. Xhuma made it effortless. The mobile preview alone sold me — it just looks premium.",
    initials: "AZ",
    avatarColor: "#38bdf8",
  },
  {
    id: "us-7",
    name: "David L",
    location: "Austin",
    headline: "Setup in under 10 minutes",
    body: "I'm not technical at all. I picked a theme, dropped my links, and was live before my coffee got cold. The receipt-style pricing page convinced me I was saving money too.",
    avatar: `${BIO_ASSETS}/user5.CwX5k9hm.png`,
  },
  {
    id: "us-8",
    name: "Priya N",
    location: "Seattle",
    headline: "AI that actually helps",
    body: "Visitors ask about my coaching packages and the AI points them to the right link. I wake up to booked calls without answering the same DMs over and over.",
    initials: "PN",
    avatarColor: "#f59e0b",
  },
  {
    id: "us-9",
    name: "Lucas M",
    location: "Boston",
    headline: "Clean, fast, reliable",
    body: "Page loads instantly on mobile. Analytics are clear. I can see which links perform and adjust weekly. Exactly what a link-in-bio should be in 2026.",
    avatar: `${BIO_ASSETS}/user6.BtYp0XeA.png`,
  },
  {
    id: "us-10",
    name: "Emma T",
    location: "Atlanta",
    headline: "Better than Linktree",
    body: "Switched from Linktree Pro and I'm not going back. More features, better design, and the AI chat keeps people on my page longer. My click-through rate doubled.",
    avatar: `${BIO_ASSETS}/user7.BJbxwnbs.png`,
  },
  {
    id: "us-11",
    name: "Carlos V",
    location: "Chicago",
    headline: "Perfect for small business",
    body: "My bakery uses Xhuma for the menu, orders, and Instagram. Customers find everything in one tap. The holiday theme was a hit in December.",
    initials: "CV",
    avatarColor: "#22c55e",
  },
  {
    id: "us-12",
    name: "Hannah W",
    location: "New York",
    headline: "Design that stands out",
    body: "Every other link-in-bio looks the same. Xhuma themes feel custom. I get compliments on my page weekly — and I didn't hire a designer.",
    avatar: `${BIO_ASSETS}/user9.BTGRzHLW.png`,
  },
]

export function getRegionalCreators(region: RegionCode) {
  return region === "US" ? US_CREATORS : bioCreators
}

export function getRegionalTestimonials(region: RegionCode): BioTestimonial[] {
  return region === "US" ? US_TESTIMONIALS : bioTestimonials
}

export function getHeroMockupAlts(region: RegionCode): string[] {
  if (region === "US") {
    return [
      "Xhuma link-in-bio page for a New York photographer on iPhone",
      "Xhuma link-in-bio page for a beauty creator on iPhone",
      "Xhuma link-in-bio page with AI assistant on iPhone",
    ]
  }
  return [
    "Xhuma link-in-bio page for a Cape Town photographer on iPhone",
    "Xhuma link-in-bio page for a beauty creator on iPhone",
    "Xhuma link-in-bio page with AI assistant on iPhone",
  ]
}

import type { BlogPost, PricingPlan, Testimonial } from "@/lib/types"

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    description: "Everything you need to launch your first page.",
    features: [
      "1 Link in Bio page",
      "Unlimited links",
      "Basic themes",
      "Standard analytics",
      "Linkly badge",
    ],
    cta: "Get started free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 12,
    description: "For creators who want to grow and stand out.",
    features: [
      "Everything in Starter",
      "AI Studio (Bio, Themes, Links)",
      "Custom domains",
      "Advanced analytics",
      "Remove Linkly badge",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start Pro trial",
  },
  {
    id: "business",
    name: "Business",
    price: 39,
    description: "Scale your brand with team tools and insights.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "AI Brand Identity suite",
      "Audience CRM & exports",
      "A/B testing",
      "Dedicated manager",
    ],
    cta: "Contact sales",
  },
]

export const comparisonRows: { feature: string; starter: boolean; pro: boolean; business: boolean }[] = [
  { feature: "Unlimited links", starter: true, pro: true, business: true },
  { feature: "Custom domain", starter: false, pro: true, business: true },
  { feature: "AI Studio tools", starter: false, pro: true, business: true },
  { feature: "Advanced analytics", starter: false, pro: true, business: true },
  { feature: "A/B testing", starter: false, pro: false, business: true },
  { feature: "Team members", starter: false, pro: false, business: true },
  { feature: "Remove badge", starter: false, pro: true, business: true },
  { feature: "Priority support", starter: false, pro: true, business: true },
]

export const testimonials: Testimonial[] = [
  { id: "1", name: "Aria Stone", role: "Music Producer", avatar: "/images/avatars/aria.png", quote: "Linkly's AI wrote my bio in seconds and it converts better than anything I'd written in years." },
  { id: "2", name: "Maya Chen", role: "Engineer & Educator", avatar: "/images/avatars/maya.png", quote: "The analytics finally show me what my audience actually clicks. Game changer for my newsletter." },
  { id: "3", name: "Leo Martins", role: "Illustrator", avatar: "/images/avatars/leo.png", quote: "I set up a gorgeous page in five minutes. My print sales doubled the first month." },
  { id: "4", name: "Zoe Park", role: "Photographer", avatar: "/images/avatars/zoe.png", quote: "The AI theme generator nailed my aesthetic on the first try. It feels like it read my mind." },
  { id: "5", name: "Noah Reed", role: "Founder", avatar: "/images/avatars/noah.png", quote: "We onboarded our whole creator team. The brand identity tools keep everyone consistent." },
  { id: "6", name: "Kai Rivera", role: "Brand Strategist", avatar: "/images/avatars/kai.png", quote: "This is what every Link in Bio tool wishes it was. Premium from top to bottom." },
]

export const faqs: { q: string; a: string }[] = [
  { q: "Is Linkly really powered by AI?", a: "Yes. From writing your bio to generating themes and link suggestions, the AI Studio helps you build a high-converting page without the guesswork." },
  { q: "Can I use my own domain?", a: "On Pro and Business plans you can connect a custom domain in a couple of clicks, so your page lives on your brand." },
  { q: "Do I need a credit card to start?", a: "No. The Starter plan is free forever and you can upgrade whenever you're ready to unlock AI tools and advanced analytics." },
  { q: "Can I migrate from another platform?", a: "Absolutely. Import your existing links and we'll help you recreate your page in minutes with AI." },
  { q: "Is my data secure?", a: "We use industry-standard encryption and never sell your data. You stay in full control of your audience." },
]

export const blogPosts: BlogPost[] = [
  { id: "1", slug: "ai-bio-that-converts", title: "How to write an AI bio that actually converts", excerpt: "The anatomy of a high-performing creator bio, and how to generate one in seconds.", cover: "/images/blog/b1.png", category: "Growth", readingTime: "6 min read", author: { name: "Maya Chen", avatar: "/images/avatars/maya.png" }, date: "Jun 18, 2026" },
  { id: "2", slug: "design-trends-2026", title: "Link in Bio design trends defining 2026", excerpt: "Glassmorphism, motion, and bold gradients — the looks creators are loving this year.", cover: "/images/blog/b2.png", category: "Design", readingTime: "8 min read", author: { name: "Leo Martins", avatar: "/images/avatars/leo.png" }, date: "Jun 11, 2026" },
  { id: "3", slug: "analytics-creators-need", title: "The 5 analytics every creator should track", excerpt: "Stop guessing. These metrics tell you exactly what your audience wants.", cover: "/images/blog/b3.png", category: "Analytics", readingTime: "5 min read", author: { name: "Aria Stone", avatar: "/images/avatars/aria.png" }, date: "May 30, 2026" },
  { id: "4", slug: "monetize-your-page", title: "9 ways to monetize your Link in Bio in 2026", excerpt: "From digital products to bookings, turn your traffic into real revenue.", cover: "/images/blog/b4.png", category: "Monetization", readingTime: "10 min read", author: { name: "Kai Rivera", avatar: "/images/avatars/kai.png" }, date: "May 22, 2026" },
  { id: "5", slug: "future-of-creator-economy", title: "The future of the creator economy is owned audiences", excerpt: "Why the smartest creators are building platforms they control.", cover: "/images/blog/b1.png", category: "Strategy", readingTime: "7 min read", author: { name: "Noah Reed", avatar: "/images/avatars/noah.png" }, date: "May 14, 2026" },
  { id: "6", slug: "from-zero-to-launch", title: "From zero to launch: a creator's first week", excerpt: "A practical playbook for setting up, sharing, and growing your page fast.", cover: "/images/blog/b2.png", category: "Guides", readingTime: "9 min read", author: { name: "Zoe Park", avatar: "/images/avatars/zoe.png" }, date: "May 2, 2026" },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}

export const features = [
  { icon: "sparkles", title: "AI Studio", description: "Generate bios, themes, and link ideas tuned to your niche in one click." },
  { icon: "palette", title: "Stunning Themes", description: "Premium, customizable designs with gradients, glass, and motion built in." },
  { icon: "bar-chart-3", title: "Deep Analytics", description: "See views, clicks, CTR, devices, and geography in beautiful dashboards." },
  { icon: "smartphone", title: "Mobile-First", description: "Pages that feel like native apps on every device, from phone to desktop." },
  { icon: "zap", title: "Lightning Fast", description: "Edge-delivered pages that load instantly and never keep fans waiting." },
  { icon: "shield-check", title: "Yours to Own", description: "Custom domains, your branding, and an audience that belongs to you." },
]

export const stats = [
  { label: "Creators", value: "2.4M+" },
  { label: "Links clicked", value: "1.8B" },
  { label: "Countries", value: "190+" },
  { label: "Avg. CTR lift", value: "37%" },
]

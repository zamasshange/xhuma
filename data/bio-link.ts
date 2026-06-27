/** Bio.link-inspired content merged with Xhuma mock data */

export const BIO_CDN = "https://cdn.bio.link"
export const BIO_ASSETS = "https://bio.link/_nuxt"

export const bioHero = {
  title: "Your link-in-bio,\nnow with a brain",
  subtitle:
    "Join 3M+ creators and brands using Xhuma. Add your links, share posts, send emails, and let AI greet and guide your visitors.",
  heroFront: `${BIO_ASSETS}/hero1.DbxcVcFn.png`,
  heroBack: `${BIO_ASSETS}/hero2.Dj6JJlAa.png`,
}

export const bioCreators = [
  { name: "Charly Mata", username: "charlymatashow", image: `${BIO_ASSETS}/user1.Ba8DzGMp.png` },
  { name: "Flavia Gamonar", username: "flaviagamonar", image: `${BIO_ASSETS}/user2.CiMA-Ti0.png` },
  { name: "Austin Archer", username: "austinarcher", image: `${BIO_ASSETS}/user3.w1PRNQjx.png` },
  { name: "AC Milan", username: "acmilan", image: `${BIO_ASSETS}/user4.Bo0FbbWl.png` },
  { name: "Jo Franco", username: "jo_franco", image: `${BIO_ASSETS}/user5.CwX5k9hm.png` },
  { name: "Erick Donoghue", username: "edon_productions", image: `${BIO_ASSETS}/user6.BtYp0XeA.png` },
  { name: "Air Square", username: "airsquare", image: `${BIO_ASSETS}/user7.BJbxwnbs.png` },
  { name: "18*90 Bowling", username: "1890bowling", image: `${BIO_ASSETS}/user8.C6dud4fg.png` },
  { name: "Leonardo D'Ingeo", username: "dielle", image: `${BIO_ASSETS}/user9.BTGRzHLW.png` },
  { name: "Lore Aquino Música", username: "loreaquino", image: `${BIO_ASSETS}/user10.Dzm4B_2D.png` },
  { name: "Padre Paulo Ricardo", username: "padrepauloricardo", image: `${BIO_ASSETS}/user11.R_TCStqE.png` },
  { name: "Lana Brandorne", username: "lanabrandorne", image: `${BIO_ASSETS}/user12.ZeT4kErD.png` },
  { name: "TbO&Vega", username: "tbovega", image: `${BIO_ASSETS}/user13.CkAwBvvN.png` },
  { name: "The Attachment Key", username: "theattachmentkey", image: `${BIO_ASSETS}/user14.BM45zxPw.png` },
]

export const bioThemes = [
  { id: "summer", name: "Summer", image: `${BIO_ASSETS}/summer._wbdH2hK.png` },
  { id: "retro", name: "Retro", image: `${BIO_ASSETS}/retro.tmNX0151.png` },
  { id: "xmas", name: "Holiday", image: `${BIO_ASSETS}/xmas.C56RcPlE.png` },
  { id: "basic", name: "Basic", image: `${BIO_ASSETS}/basic.DuPDlgvB.png` },
  { id: "rainy", name: "Rainy Night", image: `${BIO_ASSETS}/rainy-night.fNTxc-2o.png` },
  { id: "strawberry", name: "Strawberry", image: `${BIO_ASSETS}/strawberry.BJSzuun2.png` },
  { id: "chameleon", name: "Chameleon", image: `${BIO_ASSETS}/chameleon.C-GjyGpf.png` },
  { id: "pride", name: "Pride", image: `${BIO_ASSETS}/pride.BpG7t3VB.png` },
  { id: "desert", name: "Desert", image: `${BIO_ASSETS}/desert.DXvdLGal.png` },
]

export const bioSiteExtras = [
  { id: "speed", label: "Lightning fast", image: `${BIO_CDN}/landing/feature/extras/speed.png` },
  { id: "custom-theme", label: "Custom themes", image: `${BIO_CDN}/landing/feature/extras/custom-theme.png` },
  { id: "mobile-app", label: "Mobile app", image: `${BIO_CDN}/landing/feature/extras/mobile-app.png` },
  { id: "seo", label: "SEO optimized", image: `${BIO_CDN}/landing/feature/extras/seo-optimized.png` },
  { id: "visitors", label: "Unlimited visitors", image: `${BIO_CDN}/landing/feature/extras/unlimited-visitors.png` },
]

export const bioFeatures = [
  {
    id: "domain",
    title: "Use the domain name of your choice",
    image: `${BIO_ASSETS}/custom-domain.d96u-u6L.png`,
    span: "1",
    carousel: false,
  },
  {
    id: "complete",
    title: "Everything you need for a complete site",
    image: "",
    span: "1",
    carousel: true,
  },
  {
    id: "stats",
    title: "Real time stats, track your site's performance",
    image: `${BIO_ASSETS}/performance.DYsy04ju.png`,
    span: "1",
    carousel: false,
  },
  {
    id: "embed",
    title: "Embed your favorite apps and content",
    image: `${BIO_ASSETS}/embed-apps.ChJk5fCj.png`,
    span: "2",
    carousel: false,
  },
  {
    id: "websites",
    title: "Create as many websites as you want",
    image: `${BIO_ASSETS}/theme-view.FmNdtPOT.png`,
    span: "3",
    carousel: false,
  },
  {
    id: "subscribers",
    title: "Build an email list of subscribers",
    image: `${BIO_ASSETS}/subscribers-list.CnE2Z7vq.png`,
    span: "1",
    carousel: false,
  },
  {
    id: "posts",
    title: "Publish posts and alert your subscribers",
    image: `${BIO_ASSETS}/post-alerts.CdJFb7gd.png`,
    span: "1",
    carousel: false,
  },
  {
    id: "qr",
    title: "Share your QR code anywhere",
    image: `${BIO_ASSETS}/qr-code.UaOi1mtb.png`,
    span: "1",
    carousel: false,
  },
]

export const bioPricing = {
  monthly: 14.99,
  yearly: 7.49,
  features: [
    "Unlimited sites & Unlimited visitors",
    "AI Chat doubles engagement by visitors",
    "Use your own custom domain",
    "No branding, fully white-label",
    "Publish posts and build email list",
  ],
}

export const bioComparison = [
  { title: "Mobile-first Link-in-bio page", replaces: "Replaces Linktree, Beacons", price: 15, icon: "📱" },
  { title: "Smart AI Assistant", replaces: "Replaces ManyChat, ChatGPT widgets", price: 20, icon: "🧠" },
  { title: "Custom domain support", replaces: "Replaces Framer, Webflow", price: 14, icon: "🌐" },
  { title: "Built‑in analytics & SEO", replaces: "Replaces Google Analytics, Bit.ly", price: 10, icon: "📈" },
  { title: "Email list & newsletter builder", replaces: "Replaces Mailchimp, ActiveCampaign", price: 15, icon: "✉️" },
  { title: "Publish blog posts/updates", replaces: "Replaces Substack, Blogger", price: 10, icon: "📝" },
]

export type BioTestimonial = {
  id: string
  name: string
  location: string
  headline: string
  body: string
  avatar?: string
  initials?: string
  avatarColor?: string
}

export const bioTestimonials: BioTestimonial[] = [
  {
    id: "1",
    name: "Yan P",
    location: "Peru",
    headline: "Freedom like no other",
    body: "I love the freedom Xhuma gives me. I can customize my page exactly how I want, add my links, and even use AI to engage with my audience. It's the best link-in-bio tool I've ever used.",
    avatar: `${BIO_ASSETS}/user1.Ba8DzGMp.png`,
  },
  {
    id: "2",
    name: "Tatiana I",
    location: "Brazil",
    headline: "Awesome service, fair price, very fast",
    body: "I was looking for a link-in-bio tool that was easy to use and affordable. Xhuma exceeded my expectations. The setup was quick, and the AI assistant is a game-changer for my business.",
    initials: "TI",
    avatarColor: "#a855f7",
  },
  {
    id: "3",
    name: "Alex C",
    location: "United States",
    headline: "My go-to for everything",
    body: "From links to email capture to AI chat — it's all here. I cancelled three other subscriptions after switching. My page looks professional and converts better than ever.",
    initials: "AC",
    avatarColor: "#ec4899",
  },
  {
    id: "4",
    name: "María G",
    location: "Mexico",
    headline: "Finally, one tool that does it all",
    body: "I used to juggle Linktree, Mailchimp, and a separate analytics tool. Xhuma replaced all of them. The themes are beautiful and my followers love the AI assistant.",
    avatar: `${BIO_ASSETS}/user2.CiMA-Ti0.png`,
  },
  {
    id: "5",
    name: "James K",
    location: "United Kingdom",
    headline: "Worth every penny",
    body: "The yearly plan is a steal. Custom domain, unlimited visitors, and the AI actually answers questions about my courses. Support responded within hours when I had a domain question.",
    avatar: `${BIO_ASSETS}/user3.w1PRNQjx.png`,
  },
  {
    id: "6",
    name: "Sofia R",
    location: "Spain",
    headline: "Creators, this is it",
    body: "As a musician I needed streaming links, tour dates, and merch in one place. Xhuma made it effortless. The mobile preview alone sold me — it just looks premium.",
    initials: "SR",
    avatarColor: "#38bdf8",
  },
  {
    id: "7",
    name: "David L",
    location: "Canada",
    headline: "Setup in under 10 minutes",
    body: "I'm not technical at all. I picked a theme, dropped my links, and was live before my coffee got cold. The receipt-style pricing page convinced me I was saving money too.",
    avatar: `${BIO_ASSETS}/user5.CwX5k9hm.png`,
  },
  {
    id: "8",
    name: "Priya N",
    location: "India",
    headline: "AI that actually helps",
    body: "Visitors ask about my coaching packages and the AI points them to the right link. I wake up to booked calls without answering the same DMs over and over.",
    initials: "PN",
    avatarColor: "#f59e0b",
  },
  {
    id: "9",
    name: "Lucas M",
    location: "Portugal",
    headline: "Clean, fast, reliable",
    body: "Page loads instantly on mobile. Analytics are clear. I can see which links perform and adjust weekly. Exactly what a link-in-bio should be in 2026.",
    avatar: `${BIO_ASSETS}/user6.BtYp0XeA.png`,
  },
  {
    id: "10",
    name: "Emma T",
    location: "Australia",
    headline: "Better than Linktree",
    body: "Switched from Linktree Pro and I'm not going back. More features, better design, and the AI chat keeps people on my page longer. My click-through rate doubled.",
    avatar: `${BIO_ASSETS}/user7.BJbxwnbs.png`,
  },
  {
    id: "11",
    name: "Carlos V",
    location: "Colombia",
    headline: "Perfect for small business",
    body: "My bakery uses Xhuma for the menu, WhatsApp orders, and Instagram. Customers find everything in one tap. The holiday theme was a hit in December.",
    initials: "CV",
    avatarColor: "#22c55e",
  },
  {
    id: "12",
    name: "Hannah W",
    location: "Germany",
    headline: "Design that stands out",
    body: "Every other link-in-bio looks the same. Xhuma themes feel custom. I get compliments on my page weekly — and I didn't hire a designer.",
    avatar: `${BIO_ASSETS}/user9.BTGRzHLW.png`,
  },
]

export const bioTestimonialSocialProof = {
  count: "1.5 million",
  avatars: [
    `${BIO_ASSETS}/user1.Ba8DzGMp.png`,
    `${BIO_ASSETS}/user4.Bo0FbbWl.png`,
    `${BIO_ASSETS}/user10.Dzm4B_2D.png`,
  ],
}

export const bioFaqs = [
  {
    q: "What is Xhuma, really? How is it different from a regular 'link in bio' tool?",
    a: "Xhuma is a full personal site built for creators. Unlike traditional link-in-bio pages, Xhuma is fully customizable, supports posts, emails, and embeds, includes advanced analytics, and comes with a built-in AI assistant that talks to your visitors using your content. It's not just a landing page — it's a real creator site.",
  },
  {
    q: "How does the AI assistant work?",
    a: "Once you set up your site and add your content — links, descriptions, posts, and a short knowledge base — the AI uses that information to answer visitor questions. It helps them find what they're looking for faster, without needing you to be online or respond manually.",
  },
  {
    q: "Is Xhuma mobile-friendly?",
    a: "Yes, your site is fully responsive. Whether it's opened on a phone, tablet, or desktop, it looks and works great.",
  },
  {
    q: "Can I customize the look of my page?",
    a: "Yes. You can choose from multiple themes, edit fonts and colors, add a profile image, and rearrange sections. Your page is entirely yours — and you can update it anytime.",
  },
  {
    q: "Can I use a custom domain?",
    a: "Absolutely. You can connect your own domain (like yourname.com) or use your default xhuma.cc URL.",
  },
  {
    q: "How do creators typically use Xhuma?",
    a: "Creators use Xhuma in a variety of ways depending on what they do. Podcasters share episodes and let AI answer questions about guests. Coaches route leads to booking links. Artists use it as a portfolio hub. Musicians promote releases and tour dates. Whatever your niche, Xhuma helps turn visitors into supporters — with less effort from you.",
  },
  {
    q: "What analytics do I get?",
    a: "You can track views, link clicks, popular content, and visitor interactions with your AI — all from your dashboard. It helps you understand what's working and where your audience is going.",
  },
  {
    q: "What kind of knowledge base do I need to create?",
    a: "You can add anything you'd like your visitors to know: who you are, what you offer, how to work with you, or where to find your best content. The more specific and structured your knowledge base, the more helpful your AI will be.",
  },
]

export const bioAiSection = {
  appImage: `${BIO_ASSETS}/app.CDcVvWgI.png`,
  webImage: `${BIO_ASSETS}/web.PaOVIDOc.png`,
  mobilePreview: `${BIO_ASSETS}/mob-view.Dgu78Lz3.png`,
}

export const bioFooterLinks = [
  { label: "Features", href: "/features" },
  { label: "Help Center", href: "/faq" },
  { label: "Terms of Use", href: "/about" },
  { label: "Privacy Policy", href: "/about" },
  { label: "Report", href: "/contact" },
]

export const bioSocialLinks = [
  { label: "X", href: "https://twitter.com/@biodotlink" },
  { label: "Instagram", href: "https://www.instagram.com/biodotlink/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCMtHlkP8mJDQjxHPkwOOnbQ" },
  { label: "TikTok", href: "https://tiktok.com/@biodotlink" },
]

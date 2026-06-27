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
  { title: "Mobile-first Link-in-bio page", replaces: "Replaces Linktree, Beacons", price: 15 },
  { title: "Smart AI Assistant", replaces: "Replaces ManyChat, ChatGPT widgets", price: 20 },
  { title: "Custom domain support", replaces: "Replaces Framer, Webflow", price: 14 },
  { title: "Built‑in analytics & SEO", replaces: "Replaces Google Analytics, Bit.ly", price: 10 },
  { title: "Email list & newsletter builder", replaces: "Replaces Mailchimp, ActiveCampaign", price: 15 },
  { title: "Publish blog posts/updates", replaces: "Replaces Substack, Blogger", price: 10 },
]

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
    a: "Absolutely. You can connect your own domain (like yourname.com) or use your default xhuma.io URL.",
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
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Explore", href: "/explore" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
]

export const bioSocialLinks = [
  { label: "X", href: "https://twitter.com/@biodotlink" },
  { label: "Instagram", href: "https://www.instagram.com/biodotlink/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCMtHlkP8mJDQjxHPkwOOnbQ" },
  { label: "TikTok", href: "https://tiktok.com/@biodotlink" },
]

export type LinkItem = {
  id: string
  title: string
  description?: string
  url: string
  icon: string
  color?: string
  visible: boolean
  pinned?: boolean
  clicks: number
}

export type SocialLink = {
  platform: string
  url: string
}

export type GalleryImage = {
  id: string
  src: string
  alt: string
}

export type ServiceItem = {
  id: string
  title: string
  description: string
  price: string
}

export type ProfileTestimonial = {
  id: string
  name: string
  role: string
  avatar: string
  quote: string
}

export type Profile = {
  username: string
  displayName: string
  headline: string
  bio: string
  occupation: string
  pronouns?: string
  location: string
  website: string
  email: string
  phone?: string
  avatar: string
  cover?: string
  verified: boolean
  category: ProfileCategory
  socials: SocialLink[]
  links: LinkItem[]
  gallery: GalleryImage[]
  services: ServiceItem[]
  testimonials: ProfileTestimonial[]
  spotifyEmbed?: string
  youtubeEmbed?: string
  theme: ProfileTheme
}

export type ProfileTheme = {
  preset: string
  accent: string
  background: "gradient" | "solid" | "mesh"
  buttonStyle: "solid" | "outline" | "soft" | "glass"
  buttonRadius: "sm" | "md" | "lg" | "full"
  font: "sans" | "serif" | "mono"
  avatarShape: "circle" | "rounded" | "square"
}

export type ProfileCategory =
  | "Creators"
  | "Artists"
  | "Businesses"
  | "Developers"
  | "Musicians"
  | "Designers"
  | "Photographers"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  cover: string
  category: string
  readingTime: string
  author: { name: string; avatar: string }
  date: string
}

export type PricingPlan = {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  avatar: string
  quote: string
}

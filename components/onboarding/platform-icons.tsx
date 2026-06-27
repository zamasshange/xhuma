import type { OnboardingPlatform } from "@/data/onboarding"

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 12s0-3.5-.5-5.2c-.3-1.1-1.2-2-2.3-2.3C17.5 4 12 4 12 4s-5.5 0-7.2.5c-1.1.3-2 1.2-2.3 2.3C2 8.5 2 12 2 12s0 3.5.5 5.2c.3 1.1 1.2 2 2.3 2.3C6.5 20 12 20 12 20s5.5 0 7.2-.5c1.1-.3 2-1.2 2.3-2.3C22 15.5 22 12 22 12z" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" />
    </svg>
  )
}

function TiktokIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 24" fill="currentColor" aria-hidden="true">
      <path d="M14 4.5c.8 1.6 2.2 2.8 4 3.2v3.4c-1.5-.1-2.9-.6-4-1.5v7.4c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .7 0 1 .1v3.5c-.3-.1-.7-.2-1-.2-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V0h3.5v4.5z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.09 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.09 24 12.07z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.4 22H2.3l7.3-8.4L1 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z" />
    </svg>
  )
}

function SnapchatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.5 0 4.5 2 4.5 5.2 0 .8-.2 1.5-.5 2.2 2.5.6 4.3 1.5 5.5 2.5.8.7 1 1.5.5 2.2-.8 1-2.8 1.2-4.5 1.2.3 1.2.5 2.5-.2 3.5-.8 1.2-2.5 1.5-4.3 1.5s-3.5-.3-4.3-1.5c-.7-1-.5-2.3-.2-3.5-1.7 0-3.7-.2-4.5-1.2-.5-.7-.3-1.5.5-2.2 1.2-1 3-1.9 5.5-2.5-.3-.7-.5-1.4-.5-2.2C7.5 4 9.5 2 12 2z" />
    </svg>
  )
}

function CoffeeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
      <path d="M18 10h1a3 3 0 0 1 0 6h-1M6 2v2M10 2v2M14 2v2" />
    </svg>
  )
}

function WebsiteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function SpotifyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
    </svg>
  )
}

const ICONS: Record<OnboardingPlatform["icon"], () => React.ReactNode> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  facebook: FacebookIcon,
  x: XIcon,
  snapchat: SnapchatIcon,
  coffee: CoffeeIcon,
  website: WebsiteIcon,
  spotify: SpotifyIcon,
  linkedin: LinkedinIcon,
}

export function PlatformIcon({ name }: { name: OnboardingPlatform["icon"] }) {
  const Icon = ICONS[name]
  return <Icon />
}

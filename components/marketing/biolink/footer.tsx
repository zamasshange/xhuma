import Link from "next/link"
import { BIO_CDN, bioFooterLinks, bioSocialLinks } from "@/data/bio-link"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"

export function BiolinkFooter() {
  return (
    <footer className="mx-auto w-[min(1100px,92%)] bg-white pb-10 pt-4 max-sm:pb-8">
      <WaveDivider />

      <div className="mt-14 flex flex-wrap items-start justify-between gap-10 max-lg:flex-col max-lg:items-center max-sm:mt-10">
        <div className="max-lg:flex max-lg:flex-col max-lg:items-center">
          <div className="flex items-center gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=app.biolink"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BIO_CDN}/landing/google-play2.png`} alt="Get it on Google Play" className="h-[42px] w-auto" />
            </a>
            <a
              href="https://apps.apple.com/app/bio-link-link-in-bio/id1573294119"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BIO_CDN}/landing/app-store1.png`} alt="Download on the App Store" className="h-[42px] w-auto" />
            </a>
          </div>

          <nav className="mt-8 flex flex-wrap gap-x-8 gap-y-3 max-lg:justify-center">
            {bioFooterLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-normal text-bio-dark transition-colors hover:text-bio-dark/70"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6 max-sm:gap-5">
          {bioSocialLinks.map((social) => (
            <SocialIcon key={social.label} href={social.href} label={social.label} />
          ))}
          <LogoMark href="/" height={28} label="Xhuma home" className="transition-transform hover:scale-105" />
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-bio-grey max-sm:mt-8">© {new Date().getFullYear()} Xhuma. All rights reserved.</p>
    </footer>
  )
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-bio-dark transition-transform hover:scale-105"
      aria-label={label}
    >
      <SocialGlyph name={label} />
    </a>
  )
}

function SocialGlyph({ name }: { name: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 30 30", fill: "none" as const }

  if (name === "X") {
    return (
      <svg {...common}>
        <path
          d="M2.01611 3.21881H9.69628L16.7953 12.7678L25.6317 3L27.7313 3.03647L17.842 14.1415L27.9839 27.7812H20.3067L13.6064 18.8826L5.42107 28H3.35497L12.59 17.5818L2.01611 3.21881ZM8.97209 4.62898H4.91596L21.1435 26.3345H25.1266L8.97209 4.62898Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  if (name === "Instagram") {
    return (
      <svg {...common}>
        <path
          d="M22 7H24M9 1H21C25.4183 1 29 4.58172 29 9V21C29 25.4183 25.4183 29 21 29H9C4.58172 29 1 25.4183 1 21V9C1 4.58172 4.58172 1 9 1ZM15 21C11.6863 21 9 18.3137 9 15C9 11.6863 11.6863 9 15 9C18.3137 9 21 11.6863 21 15C21 18.3137 18.3137 21 15 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  }
  if (name === "YouTube") {
    return (
      <svg {...common}>
        <path
          d="M30.372 9.26956C30.21 8.62242 29.8801 8.02949 29.4157 7.55065C28.9512 7.07182 28.3686 6.72403 27.7267 6.54242C25.3813 5.96973 16 5.96973 16 5.96973C16 5.96973 6.61867 5.96973 4.27334 6.59697C3.63143 6.77857 3.04882 7.12636 2.58435 7.6052C2.11988 8.08403 1.79 8.67696 1.62802 9.3241C1.19879 11.7043 0.988829 14.1188 1.00078 16.5374C0.985479 18.9741 1.19545 21.4071 1.62802 23.8052C1.80659 24.4322 2.14387 25.0026 2.60726 25.4612C3.07065 25.9198 3.64449 26.2511 4.27334 26.4232C6.61867 27.0505 16 27.0504 16 27.0504C16 27.0504 25.3813 27.0505 27.7267 26.4232C28.3686 26.2416 28.9512 25.8938 29.4157 25.415C29.8801 24.9361 30.21 24.3432 30.372 23.6961C30.7979 21.3338 31.0078 18.9377 30.9992 16.5374C31.0145 14.1006 30.8046 11.6677 30.372 9.26956V9.26956Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  }
  if (name === "TikTok") {
    return (
      <svg {...common}>
        <path
          d="M19.5 9.5V13.5C19.5 17.09 16.59 20 13 20C9.41 20 6.5 17.09 6.5 13.5C6.5 9.91 9.41 7 13 7C13.55 7 14.08 7.09 14.58 7.25V11.25C14.08 11.09 13.55 11 13 11C11.62 11 10.5 12.12 10.5 13.5C10.5 14.88 11.62 16 13 16C14.38 16 15.5 14.88 15.5 13.5V3H19.5C19.5 5.5 21.5 7.5 24 7.5V11.5C22.5 11.5 20.9 10.8 19.5 9.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  return null
}

function WaveDivider() {
  return (
    <svg width="100%" height="10" viewBox="0 0 1101 8" fill="none" className="opacity-70" aria-hidden="true">
      <path
        d="M0 6.97C38.3 6.97 76.6 0.61 114.9 0.61C153.2 0.97 191.5 6.97 229.8 6.97C268.1 6.97 306.4 0.61 344.7 0.61C383 0.97 421.3 6.97 459.6 6.97C497.9 6.97 536.2 0.61 574.5 0.61C612.8 0.97 651.1 6.97 689.4 6.97C727.7 6.97 766 0.61 804.3 0.61C842.6 0.97 880.9 6.97 919.2 6.97C957.5 6.97 995.8 0.61 1034.1 0.61C1072.4 0.97 1100 6.97 1100 6.97"
        stroke="url(#waveGradFooter)"
      />
      <defs>
        <linearGradient id="waveGradFooter" x1="0" y1="4" x2="1100" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5858" />
          <stop offset="1" stopColor="#C058FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

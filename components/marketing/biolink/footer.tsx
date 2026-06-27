import Link from "next/link"
import { BIO_CDN, bioFooterLinks } from "@/data/bio-link"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"

export function BiolinkFooter() {
  return (
    <footer className="mx-auto mt-36 w-[min(1100px,92%)] max-sm:mt-16">
      <WaveDivider />
      <div className="mt-12 flex justify-between pb-8 max-lg:flex-wrap max-lg:justify-center">
        <div className="max-lg:w-full">
          <div className="flex items-center gap-x-2 max-lg:justify-center">
            <a href="https://play.google.com/store/apps/details?id=app.biolink" target="_blank" rel="noopener noreferrer" className="transition-transform hover:-translate-y-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BIO_CDN}/landing/google-play2.png`} alt="Get it on Google Play" className="w-[125px]" />
            </a>
            <a href="https://apps.apple.com/app/bio-link-link-in-bio/id1573294119" target="_blank" rel="noopener noreferrer" className="transition-transform hover:-translate-y-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BIO_CDN}/landing/app-store1.png`} alt="Download on the App Store" className="w-[125px]" />
            </a>
          </div>
          <div className="my-8 flex justify-center gap-8 text-base font-medium text-bio-dark max-md:gap-0">
            <div className="flex flex-wrap justify-center gap-8 max-md:grid max-md:grid-cols-2 max-md:gap-y-4">
              {bioFooterLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-base font-normal text-bio-dark transition-colors hover:text-bio-dark/80">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-8 max-md:gap-6">
          <SocialIcon href="https://twitter.com/@biodotlink" label="X">
            <path d="M2.01611 3.21881H9.69628L16.7953 12.7678L25.6317 3L27.7313 3.03647L17.842 14.1415L27.9839 27.7812H20.3067L13.6064 18.8826L5.42107 28H3.35497L12.59 17.5818L2.01611 3.21881ZM8.97209 4.62898H4.91596L21.1435 26.3345H25.1266L8.97209 4.62898Z" fill="currentColor" />
          </SocialIcon>
          <SocialIcon href="https://www.instagram.com/biodotlink/" label="Instagram">
            <path d="M22 7H24M9 1H21C25.4183 1 29 4.58172 29 9V21C29 25.4183 25.4183 29 21 29H9C4.58172 29 1 25.4183 1 21V9C1 4.58172 4.58172 1 9 1ZM15 21C11.6863 21 9 18.3137 9 15C9 11.6863 11.6863 9 15 9C18.3137 9 21 11.6863 21 15C21 18.3137 18.3137 21 15 21Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </SocialIcon>
          <SocialIcon href="https://www.youtube.com/channel/UCMtHlkP8mJDQjxHPkwOOnbQ" label="YouTube">
            <path d="M30.372 9.26956C30.21 8.62242 29.8801 8.02949 29.4157 7.55065C28.9512 7.07182 28.3686 6.72403 27.7267 6.54242C25.3813 5.96973 16 5.96973 16 5.96973C16 5.96973 6.61867 5.96973 4.27334 6.59697C3.63143 6.77857 3.04882 7.12636 2.58435 7.6052C2.11988 8.08403 1.79 8.67696 1.62802 9.3241C1.19879 11.7043 0.988829 14.1188 1.00078 16.5374C0.985479 18.9741 1.19545 21.4071 1.62802 23.8052C1.80659 24.4322 2.14387 25.0026 2.60726 25.4612C3.07065 25.9198 3.64449 26.2511 4.27334 26.4232C6.61867 27.0505 16 27.0504 16 27.0504C16 27.0504 25.3813 27.0505 27.7267 26.4232C28.3686 26.2416 28.9512 25.8938 29.4157 25.415C29.8801 24.9361 30.21 24.3432 30.372 23.6961C30.7979 21.3338 31.0078 18.9377 30.9992 16.5374C31.0145 14.1006 30.8046 11.6677 30.372 9.26956V9.26956Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </SocialIcon>
          <LogoMark
            href="/ariastone"
            height={28}
            label="Xhuma profile"
            className="transition-transform hover:scale-105"
          />
        </div>
      </div>
      <p className="pb-8 text-center text-sm text-bio-grey">© 2026 Xhuma. All rights reserved.</p>
    </footer>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-bio-dark transition-transform hover:scale-105" aria-label={label}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        {children}
      </svg>
    </a>
  )
}

function WaveDivider() {
  return (
    <svg width="100%" height="8" viewBox="0 0 1101 8" fill="none" className="opacity-50" aria-hidden="true">
      <path d="M0 6.97C38.3 6.97 76.6 0.61 114.9 0.61C153.2 0.97 191.5 6.97 229.8 6.97C268.1 6.97 306.4 0.61 344.7 0.61C383 0.97 421.3 6.97 459.6 6.97C497.9 6.97 536.2 0.61 574.5 0.61C612.8 0.97 651.1 6.97 689.4 6.97C727.7 6.97 766 0.61 804.3 0.61C842.6 0.97 880.9 6.97 919.2 6.97C957.5 6.97 995.8 0.61 1034.1 0.61C1072.4 0.97 1100 6.97 1100 6.97" stroke="url(#waveGrad)" />
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="4" x2="1100" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5858" />
          <stop offset="1" stopColor="#C058FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

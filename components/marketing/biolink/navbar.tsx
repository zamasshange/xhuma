"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/explore", label: "Explore" },
  { href: "/faq", label: "FAQ" },
]

export function BiolinkNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  const authLinks = (
    <>
      <Link
        href="/sign-in"
        className="text-sm font-semibold text-bio-dark transition-colors hover:text-bio-dark/80 lg:text-base"
      >
        Log in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-full bg-bio-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bio-dark/80 lg:px-6 lg:text-base"
      >
        Get started
      </Link>
    </>
  )

  return (
    <header className="fixed left-0 right-0 top-0 z-[999] mt-2.5">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="relative mx-auto flex h-14 w-full max-w-[1300px] items-center gap-4 rounded-[40px] bg-white px-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:h-[60px] sm:px-6">
          <LogoMark height={28} maxWidth={118} className="mr-1 flex shrink-0 items-center self-center" />

          <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto no-scrollbar lg:flex lg:gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-bio-dark transition-colors hover:text-bio-dark/80 lg:px-3 lg:text-base",
                  isActive(link.href) && "text-bio-dark",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">{authLinks}</div>

          <button
            type="button"
            className="ml-auto flex min-h-11 min-w-11 shrink-0 items-center justify-center lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg width="21" height="14" viewBox="0 0 21 14" aria-hidden="true">
              <line x1="1.625" y1="1" x2="19.125" y2="1" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="1.625" y1="7" x2="19.125" y2="7" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="1.625" y1="13" x2="19.125" y2="13" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
              <LogoMark height={28} maxWidth={118} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M12.9875 1L1 12.9875" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12.9975 13L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="px-6 pb-10">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-bio-dark/10 py-5">
                  <Link
                    href={link.href}
                    className={cn("block text-lg font-bold", isActive(link.href) && "text-bio-dark")}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="border-b border-bio-dark/10 py-5">
                <Link href="/sign-in" className="block text-lg font-bold" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </li>
              <li className="border-b border-bio-dark/10 py-5">
                <Link href="/sign-up" className="block text-lg font-bold text-bio-dark" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

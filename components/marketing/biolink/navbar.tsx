"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/explore", label: "Explore" },
  { href: "/faq", label: "FAQ" },
]

const authLinks = [
  { href: "/", label: "Home" },
  { href: "/editor", label: "My page", primary: true },
]

export function BiolinkNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="fixed left-0 right-0 top-0 z-[999] mt-2.5">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="relative mx-auto flex w-full max-w-[1300px] items-center gap-4 rounded-[40px] bg-white px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-6 sm:py-4 max-md:py-3">
          <LogoMark height={36} className="mr-1 shrink-0" />

          <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto no-scrollbar md:flex lg:gap-0">
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

          <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-4">
            <Link
              href="/editor"
              className="text-sm font-semibold text-bio-dark transition-colors hover:text-bio-dark/80 lg:text-base"
            >
              My page
            </Link>
            <Link
              href="/editor"
              className="rounded-full bg-bio-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bio-dark/80 lg:px-6 lg:text-base"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto shrink-0 md:hidden"
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
            className="fixed inset-0 z-50 bg-white md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <LogoMark height={32} />
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
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
              {authLinks.map((link) => (
                <li key={link.label} className="border-b border-bio-dark/10 py-5">
                  <Link
                    href={link.href}
                    className={cn("block text-lg font-bold", link.primary && "text-bio-dark")}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

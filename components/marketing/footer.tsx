import Link from "next/link"
import { Logo } from "@/components/logo"
import { Code, AtSign, Camera, Play } from "lucide-react"

const groups = [
  {
    title: "Product",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "AI Studio", href: "/dashboard/ai-studio" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "Privacy", href: "/about" },
      { label: "Terms", href: "/about" },
      { label: "Status", href: "/about" },
    ],
  },
]

const socials = [
  { icon: AtSign, label: "Twitter", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Code, label: "GitHub", href: "#" },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Your entire online presence, powered by AI. Build a beautiful Link in Bio page in minutes.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Xhuma. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Made for creators, everywhere.</p>
        </div>
      </div>
    </footer>
  )
}

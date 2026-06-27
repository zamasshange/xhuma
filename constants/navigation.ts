import {
  Home,
  LayoutDashboard,
  BarChart3,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  mobileOnly?: boolean
  desktopOnly?: boolean
}

/** Legacy dashboard shell — all routes redirect to /editor */
export const dashboardNav: NavItem[] = [
  { href: "/editor", label: "My page", icon: LayoutDashboard },
  { href: "/editor?tab=analytics", label: "Stats", icon: BarChart3 },
  { href: "/editor?tab=ai", label: "AI", icon: Sparkles },
  { href: "/editor?tab=settings", label: "Settings", icon: Settings },
]

export const mobileBottomNav: NavItem[] = [
  { href: "/editor", label: "Page", icon: Home },
  { href: "/editor?tab=analytics", label: "Stats", icon: BarChart3 },
  { href: "/editor?tab=ai", label: "AI", icon: Sparkles },
  { href: "/editor?tab=settings", label: "Settings", icon: Settings },
]

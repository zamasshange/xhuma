import {
  Home,
  LayoutDashboard,
  User,
  Link2,
  Palette,
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

export const dashboardNav: NavItem[] = [
  { href: "/editor", label: "My page", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export const mobileBottomNav: NavItem[] = [
  { href: "/editor", label: "Page", icon: Home },
  { href: "/dashboard/links", label: "More", icon: LayoutDashboard },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: Sparkles },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

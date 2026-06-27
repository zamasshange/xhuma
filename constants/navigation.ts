import { FaRobot } from "react-icons/fa6"
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"
import type { IconType } from "react-icons"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon | IconType
  mobileOnly?: boolean
  desktopOnly?: boolean
}

/** Legacy dashboard shell — all routes redirect to /editor */
export const dashboardNav: NavItem[] = [
  { href: "/editor", label: "My page", icon: LayoutDashboard },
  { href: "/editor?tab=analytics", label: "Stats", icon: BarChart3 },
  { href: "/editor?tab=ai", label: "AI", icon: FaRobot },
  { href: "/editor?tab=settings", label: "Settings", icon: Settings },
]

export const mobileBottomNav: NavItem[] = [
  { href: "/editor", label: "Page", icon: Home },
  { href: "/editor?tab=analytics", label: "Stats", icon: BarChart3 },
  { href: "/editor?tab=ai", label: "AI", icon: FaRobot },
  { href: "/editor?tab=settings", label: "Settings", icon: Settings },
]

import { SocialIcon, resolveSocialIconName } from "@/components/icons/social-icon"
import { Globe, Sparkles, BarChart3, Smartphone, Zap, ShieldCheck, PenLine, Type, ScanLine, Gem, Eye, MousePointerClick, Users, TrendingUp, UserPlus, Share2, Link as LinkIcon, Music, Calendar, ShoppingBag, BookOpen, GraduationCap, Mail, Palette, Image as ImageIcon, Briefcase, Play, type LucideIcon } from "lucide-react"

const lucideMap: Record<string, LucideIcon> = {
  music: Music,
  calendar: Calendar,
  "shopping-bag": ShoppingBag,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  mail: Mail,
  palette: Palette,
  video: Play,
  image: ImageIcon,
  link: LinkIcon,
  sparkles: Sparkles,
  "bar-chart-3": BarChart3,
  smartphone: Smartphone,
  zap: Zap,
  "shield-check": ShieldCheck,
  "pen-line": PenLine,
  type: Type,
  "scan-line": ScanLine,
  gem: Gem,
  eye: Eye,
  "mouse-pointer-click": MousePointerClick,
  users: Users,
  "trending-up": TrendingUp,
  "user-plus": UserPlus,
  "share-2": Share2,
}

export function Icon({
  name,
  className,
  size = 20,
}: {
  name: string
  className?: string
  size?: number
}) {
  if (resolveSocialIconName(name)) {
    return <SocialIcon name={name} size={size} className={className} />
  }

  const Cmp = lucideMap[name] ?? Globe
  return <Cmp className={className} size={size} aria-hidden="true" />
}

import Link from "next/link"
import { cn } from "@/lib/utils"

export function DarkButton({
  href,
  children,
  className,
  onClick,
}: {
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const classes = cn(
    "bio-dark-btn relative flex items-center justify-center rounded-full bg-bio-dark px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-bio-dark/80 max-sm:px-4 max-sm:py-3 max-sm:text-sm",
    className,
  )

  const inner = (
    <span className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap">
      {children}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.5518 7.62793C17.5518 7.99707 17.4229 8.31055 17.165 8.56836L11.4346 14.2812C11.1709 14.5449 10.875 14.6768 10.5469 14.6768C10.1719 14.6768 9.87012 14.5596 9.6416 14.3252C9.41309 14.0967 9.29883 13.8125 9.29883 13.4727C9.29883 13.2793 9.33398 13.1094 9.4043 12.9629C9.48047 12.8105 9.57715 12.6758 9.69434 12.5586L11.6631 10.5898L14.5723 7.91797L15.1084 8.71777L11.6982 8.90234H1.75781C1.36523 8.90234 1.0459 8.78516 0.799805 8.55078C0.55957 8.31641 0.439453 8.00879 0.439453 7.62793C0.439453 7.24707 0.55957 6.93945 0.799805 6.70508C1.0459 6.4707 1.36523 6.35352 1.75781 6.35352H11.6982L15.1084 6.53809L14.5723 7.33789L11.6631 4.66602L9.69434 2.68848C9.57715 2.57129 9.48047 2.43945 9.4043 2.29297C9.33398 2.14063 9.29883 1.96777 9.29883 1.77441C9.29883 1.43457 9.41309 1.15039 9.6416 0.921875C9.87012 0.6875 10.1719 0.570312 10.5469 0.570312C10.7051 0.570312 10.8604 0.605469 11.0127 0.675781C11.165 0.740234 11.3086 0.839844 11.4434 0.974609L17.165 6.6875C17.4229 6.93945 17.5518 7.25293 17.5518 7.62793Z"
        fill="currentColor"
      />
    </svg>
  )
}

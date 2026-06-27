import { cn } from "@/lib/utils"

export function BioCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("rounded-2xl border border-bio-dark/6 bg-bio-grey-f4 p-5 sm:p-6", className)}>
      {children}
    </div>
  )
}

export function BioLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={cn("text-sm font-semibold text-bio-dark", className)}>{children}</label>
}

const fieldClass =
  "w-full rounded-xl border border-bio-dark/10 bg-white px-4 text-base text-bio-dark outline-none transition-colors placeholder:text-bio-grey/70 focus:border-bio-dark/25 focus:ring-2 focus:ring-bio-dark/5"

export function BioInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-11", className)} {...props} />
}

export function BioTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-[88px] resize-y py-3", className)} {...props} />
}

export function BioButton({
  className,
  variant = "primary",
  children,
  href,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost"
  href?: string
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
    variant === "primary" && "bio-dark-btn bg-bio-dark text-white hover:bg-bio-dark/90",
    variant === "secondary" &&
      "border border-bio-dark/12 bg-white text-bio-dark hover:bg-bio-grey-f4",
    variant === "ghost" && "text-bio-grey hover:bg-bio-grey-f4 hover:text-bio-dark",
    className,
  )

  const inner = <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {inner}
    </button>
  )
}

export function BioSectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold tracking-tight text-bio-dark">{children}</h2>
}

export function BioMuted({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-bio-grey", className)}>{children}</p>
}

export function BioGradientButton({
  className,
  children,
  disabled,
  type = "button",
  onClick,
  href,
}: React.ComponentProps<"button"> & { href?: string }) {
  const classes = cn(
    "bio-continue-btn inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50",
    className,
  )

  const inner = children

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}

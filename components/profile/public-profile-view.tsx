"use client"

import { BadgeCheck, MapPin, Globe, Mail, Share2, QrCode } from "lucide-react"
import { motion } from "framer-motion"
import type { Profile } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { LinkButton } from "@/components/profile/link-button"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

const avatarShapeMap = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-lg",
}

const bgMap = {
  gradient: "bg-gradient-to-b from-[var(--profile-accent)]/35 via-background to-background",
  solid: "bg-background",
  mesh: "bg-[radial-gradient(ellipse_at_top,var(--profile-accent)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,var(--profile-accent)_0%,transparent_40%)] bg-background",
}

export function PublicProfileView({
  profile,
  onShare,
  onContact,
}: {
  profile: Profile
  onShare?: () => void
  onContact?: () => void
}) {
  const visibleLinks = profile.links.filter((l) => l.visible)
  const pinned = visibleLinks.find((l) => l.pinned)
  const rest = visibleLinks.filter((l) => !l.pinned)

  return (
    <div
      className={cn("relative min-h-dvh", bgMap[profile.theme.background])}
      style={{ "--profile-accent": profile.theme.accent } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[var(--profile-accent)]/20 blur-3xl animate-float-slow" />
        <div className="absolute -right-16 bottom-32 h-48 w-48 rounded-full bg-[var(--profile-accent)]/15 blur-3xl animate-float-slow-2" />
      </div>

      <div className="relative mx-auto max-w-md px-4 pb-10 pt-6">
        <div className="mb-4 flex justify-end gap-2">
          <Button variant="outline" size="icon" className="size-11 rounded-full" onClick={onShare}>
            <Share2 className="size-4.5" />
          </Button>
          <Button variant="outline" size="icon" className="size-11 rounded-full">
            <QrCode className="size-4.5" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <Avatar
            src={profile.avatar}
            alt={profile.displayName}
            className={cn("size-28 border-4 border-background shadow-xl", avatarShapeMap[profile.theme.avatarShape])}
          />
          <div className="mt-4 flex items-center gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">{profile.displayName}</h1>
            {profile.verified && <BadgeCheck className="size-6 text-[var(--profile-accent)]" />}
          </div>
          <p className="mt-1 text-base text-muted-foreground">{profile.headline}</p>
          <p className="mt-3 max-w-sm text-base leading-relaxed">{profile.bio}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <span className="flex items-center gap-1">
                <Globe className="size-3.5" />
                {profile.website}
              </span>
            )}
          </div>

          <div className="mt-5 flex gap-4">
            {profile.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                className="flex size-11 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={s.platform}
              >
                <Icon name={s.platform} className="size-5" />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3">
          {pinned && (
            <LinkButton
              title={pinned.title}
              description={pinned.description}
              icon={pinned.icon}
              accent={profile.theme.accent}
              buttonStyle={profile.theme.buttonStyle}
              buttonRadius={profile.theme.buttonRadius}
              pinned
            />
          )}
          {rest.map((link, i) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <LinkButton
                title={link.title}
                description={link.description}
                icon={link.icon}
                accent={profile.theme.accent}
                buttonStyle={profile.theme.buttonStyle}
                buttonRadius={profile.theme.buttonRadius}
              />
            </motion.div>
          ))}
        </div>

        {profile.spotifyEmbed && (
          <div className="mt-6 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
                <Icon name="spotify" className="size-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Now playing on Spotify</p>
                <p className="font-medium">{profile.spotifyEmbed}</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full bg-emerald-500" />
            </div>
          </div>
        )}

        {profile.youtubeEmbed && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card/80">
            <div className="flex aspect-video items-center justify-center bg-muted">
              <Icon name="youtube" className="size-12 text-destructive/80" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{profile.youtubeEmbed}</p>
            </div>
          </div>
        )}

        {profile.gallery.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading mb-3 text-xl font-semibold">Gallery</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {profile.gallery.map((img) => (
                <div key={img.id} className="h-36 w-28 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} className="size-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.services.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading mb-3 text-xl font-semibold">Services</h2>
            <div className="flex flex-col gap-3">
              {profile.services.map((s) => (
                <div key={s.id} className="rounded-2xl border border-border bg-card/80 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{s.title}</h3>
                    <span className="shrink-0 text-sm font-semibold text-brand">{s.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.testimonials.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading mb-3 text-xl font-semibold">Testimonials</h2>
            {profile.testimonials.map((t) => (
              <blockquote key={t.id} className="rounded-2xl border border-border bg-card/80 p-4">
                <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-3 flex items-center gap-2">
                  <Avatar src={t.avatar} alt={t.name} className="size-8" />
                  <div className="text-xs">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted-foreground">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        <Button
          className="mt-8 h-12 w-full rounded-2xl bg-brand-gradient text-base text-brand-foreground"
          onClick={onContact}
        >
          <Mail className="size-4.5" />
          Contact {profile.displayName.split(" ")[0]}
        </Button>
      </div>
    </div>
  )
}

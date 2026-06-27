"use client"

import { motion } from "framer-motion"
import { BadgeCheck, Music, Calendar, ShoppingBag, Play, Camera, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { icon: Music, label: "Listen to my new EP" },
  { icon: Calendar, label: "Book me for your event" },
  { icon: ShoppingBag, label: "Sample pack — Vol.2" },
  { icon: Play, label: "Behind the scenes" },
]

export function PhonePreview({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-[16rem] sm:w-[18rem]", className)}>
      <div className="relative rounded-[2.5rem] border border-border bg-card p-2.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[var(--brand)]/30 via-background to-background">
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/10" />
          <div className="flex flex-col items-center px-5 pb-6 pt-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/avatars/aria.png"
                alt="Aria Stone"
                className="size-20 rounded-full border-2 border-background object-cover shadow-lg"
              />
            </motion.div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="font-heading text-base font-semibold">Aria Stone</span>
              <BadgeCheck className="size-4 text-brand" />
            </div>
            <p className="text-xs text-muted-foreground">Music Producer & DJ</p>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
              Crafting late-night soundscapes & warm analog beats.
            </p>
            <div className="mt-3 flex gap-3 text-muted-foreground">
              <Camera className="size-4" />
              <Play className="size-4" />
              <AtSign className="size-4" />
              <Music className="size-4" />
            </div>
            <div className="mt-4 flex w-full flex-col gap-2.5">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/80 px-3 py-2.5 text-xs font-medium shadow-sm backdrop-blur"
                >
                  <link.icon className="size-4 text-brand" />
                  <span className="truncate">{link.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

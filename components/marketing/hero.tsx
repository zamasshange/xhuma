"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "@/components/animated-background"
import { PhonePreview } from "@/components/marketing/phone-preview"
import { stats } from "@/data/marketing"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <Sparkles className="size-3.5" />
              AI-powered Link in Bio
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-heading mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Entire Online Presence,{" "}
            <span className="text-gradient">Powered by AI.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Linkly helps creators design a stunning, high-converting Link in Bio page — with AI writing your bio, building your theme, and growing your audience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button
              render={<Link href="/editor" />}
              className="h-12 px-6 text-base bg-brand-gradient text-brand-foreground"
            >
              Get Started
              <ArrowRight className="size-4.5" />
            </Button>
            <Button
              render={<Link href="/ariastone" />}
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <Play className="size-4.5" />
              Live Demo
            </Button>
          </motion.div>

          <div className="mt-10 grid w-full grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:max-w-lg">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex flex-col items-center lg:items-start"
              >
                <span className="font-heading text-xl font-semibold sm:text-2xl">{stat.value}</span>
                <span className="text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <PhonePreview />
        </motion.div>
      </div>
    </section>
  )
}

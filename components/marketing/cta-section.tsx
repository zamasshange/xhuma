"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-accent/10 px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Your whole world, one link away
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Join millions of creators using Xhuma to grow their audience with AI. Start free, no credit card
              required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                render={<Link href="/editor" />}
                className="h-12 w-full px-6 text-base sm:w-auto bg-brand-gradient text-brand-foreground"
              >
                Claim your link
                <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/explore" />}
                variant="outline"
                className="h-12 w-full px-6 text-base sm:w-auto"
              >
                Explore creators
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

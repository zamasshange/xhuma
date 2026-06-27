"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { bioAiSection } from "@/data/bio-link"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { DarkButton } from "@/components/marketing/biolink/dark-button"

export function AiAssistantSection() {
  const [view, setView] = useState<"app" | "website">("app")

  return (
    <section className="relative border-t border-bio-dark/8 bg-white pt-24 text-bio-dark max-lg:pt-20 max-md:pt-20">
      <BioContainer>
        <div className="mb-6 text-center sm:mb-8">
          <SectionBadge>AI assistant</SectionBadge>
        </div>
        <h2 className="text-center text-6xl font-semibold leading-[1.1] tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Engage every visitor.
          <br />
          With AI, you can
        </h2>
        <h5 className="mx-auto mt-4 max-w-2xl text-center text-lg font-normal max-sm:text-base">
          Your AI assistant is trained on your content to guide your visitors,
          <br className="hidden sm:inline" />
          answer questions, and keep them engaged.
        </h5>
        <div className="mt-8 flex justify-center max-sm:mt-6">
          <DarkButton href="/editor?tab=ai" className="w-[220px] max-sm:w-[200px]">
            Get started for free
          </DarkButton>
        </div>

        <div className="relative mx-auto mt-10 flex w-[168px] rounded-full bg-bio-dark/5 px-1.5 py-[3px]">
        {(["app", "website"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setView(tab)}
            className={cn(
              "relative z-10 flex h-10 flex-1 cursor-pointer items-center justify-center px-4 text-sm font-semibold capitalize text-bio-dark",
            )}
          >
            {tab === "app" ? "App" : "Website"}
          </button>
        ))}
        <div
          className="absolute top-[5px] h-9 rounded-full bg-white shadow-md transition-transform duration-300"
          style={{
            width: view === "app" ? "67px" : "88px",
            transform: view === "app" ? "translateX(6px)" : "translateX(74px)",
          }}
        />
        </div>
      </BioContainer>

      <div className="relative mt-10 flex max-h-[70vh] items-center justify-center bg-white max-lg:mt-8 max-lg:h-auto max-lg:max-h-none max-sm:mt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={view === "app" ? bioAiSection.appImage : bioAiSection.webImage}
          alt={view === "app" ? "Xhuma mobile app" : "Xhuma website"}
          className="h-auto max-h-[65vh] w-[min(65%,320px)] object-contain transition-opacity duration-200 sm:w-[min(55%,400px)]"
        />
      </div>
    </section>
  )
}

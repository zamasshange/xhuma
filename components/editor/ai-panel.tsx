"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { AiIcon } from "@/components/icons/app-icons"
import { AiLinkRecommendations } from "@/components/ai/ai-link-recommendations"
import { AiQuickActions } from "@/components/ai/ai-quick-actions"
import { AiThemeAssistant } from "@/components/ai/ai-theme-assistant"
import { ProfileHealthCard } from "@/components/ai/profile-health-card"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioCard, BioInput, BioMuted, BioSectionTitle, BioTextarea } from "@/components/ui/bio-form"
import { Badge } from "@/components/ui/badge"
import { SocialIconBadge, resolveLinkIcon } from "@/components/icons/social-icon"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import { apiFetch } from "@/lib/api-fetch"
import { cn } from "@/lib/utils"

const TOOLS = [
  { id: "studio", title: "AI Studio" },
  { id: "bio", title: "Bio Generator" },
  { id: "links", title: "Link Suggestions" },
  { id: "button", title: "Button Writer" },
] as const

export function AiPanel() {
  const { profile, state, updateProfile, refresh, persistLiveLink, addLink, mode } = useEditor()
  const [activeTool, setActiveTool] = useState<(typeof TOOLS)[number]["id"]>("studio")
  const [loading, setLoading] = useState(false)

  const [bioInput, setBioInput] = useState("")
  const [bios, setBios] = useState<string[]>([])
  const [profession, setProfession] = useState("")
  const [suggestedLinks, setSuggestedLinks] = useState<{ title: string; url: string }[]>([])
  const [buttonPlatform, setButtonPlatform] = useState("instagram")
  const [buttonText, setButtonText] = useState("")

  const generateBio = async () => {
    setLoading(true)
    const res = await apiFetch<{ bios: string[] }>("/api/ai/bio", {
      method: "POST",
      body: JSON.stringify({ text: bioInput }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Generation failed")
      return
    }
    setBios(res.data.bios)
  }

  const generateLinks = async () => {
    setLoading(true)
    const res = await apiFetch<{ links: { title: string; url: string }[] }>("/api/ai/links", {
      method: "POST",
      body: JSON.stringify({ profession }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Generation failed")
      return
    }
    setSuggestedLinks(res.data.links)
  }

  const generateButton = async () => {
    setLoading(true)
    const res = await apiFetch<{ text: string }>("/api/ai/button-text", {
      method: "POST",
      body: JSON.stringify({ platform: buttonPlatform }),
    })
    setLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.error ?? "Generation failed")
      return
    }
    setButtonText(res.data.text)
  }

  const applyBio = async (bio: string) => {
    if (mode === "draft" || !profile) {
      updateProfile({ bio })
      toast.success("Bio applied!")
      return
    }
    const res = await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ bio }) })
    if (!res.success) {
      toast.error(res.error ?? "Could not apply bio")
      return
    }
    await refresh()
    toast.success("Bio applied!")
  }

  const addSuggestedLink = async (link: { title: string; url: string }) => {
    const icon = inferLinkIcon(link.title, link.url)
    if (mode === "draft") {
      addLink(link.title, link.url, icon)
      toast.success(`${link.title} added!`)
      return
    }
    const ok = await persistLiveLink(link.title, link.url, icon)
    if (!ok) {
      toast.error("Could not add link")
      return
    }
    toast.success(`${link.title} added!`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BioSectionTitle>AI Creator Assistant</BioSectionTitle>
        <BioMuted className="mt-1">
          AI woven into your workflow{profile ? ` (@${profile.username})` : ""}. All suggestions are editable.
        </BioMuted>
      </div>

      <ProfileHealthCard compact />

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold min-h-[44px]",
              activeTool === tool.id
                ? "border-bio-dark bg-bio-dark text-white"
                : "border-bio-dark/10 bg-white text-bio-grey hover:border-bio-dark/25",
            )}
          >
            {tool.title}
          </button>
        ))}
      </div>

      {activeTool === "studio" && (
        <div className="flex flex-col gap-4">
          <BioCard>
            <AiQuickActions />
          </BioCard>
          <AiThemeAssistant />
          <AiLinkRecommendations />
        </div>
      )}

      {activeTool === "bio" && (
        <BioCard className="space-y-4">
          <h3 className="font-semibold text-bio-dark">AI Bio Generator</h3>
          <BioTextarea
            placeholder="Tell us about yourself — role, vibe, location (e.g. DJ in Johannesburg)..."
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
          <BioButton onClick={generateBio} disabled={loading || !bioInput.trim()} className="h-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <AiIcon className="size-4" />}
            Generate Bio
          </BioButton>
          {bios.length > 0 && (
            <div className="grid gap-3">
              {bios.map((bio, i) => (
                <div key={i} className="rounded-2xl border-2 border-bio-dark/10 bg-white p-4">
                  <Badge variant="secondary" className="mb-2">Option {i + 1}</Badge>
                  <p className="text-sm leading-relaxed text-bio-dark">{bio}</p>
                  <BioButton variant="secondary" className="mt-3 h-10 w-full text-xs" onClick={() => applyBio(bio)} disabled={!state}>
                    Use this bio
                  </BioButton>
                </div>
              ))}
            </div>
          )}
        </BioCard>
      )}

      {activeTool === "links" && (
        <BioCard className="space-y-4">
          <h3 className="font-semibold text-bio-dark">AI Link Suggestions</h3>
          <BioInput
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Your profession or bio snippet"
          />
          <BioButton onClick={generateLinks} disabled={loading || !profession.trim()} className="h-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <AiIcon className="size-4" />}
            Get Suggestions
          </BioButton>
          {suggestedLinks.length > 0 && (
            <div className="grid gap-2">
              {suggestedLinks.map((link) => (
                <div key={link.title} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-bio-dark/10 bg-white p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <SocialIconBadge icon={resolveLinkIcon(null, link.title, link.url)} size={40} />
                    <span className="truncate font-medium text-bio-dark">{link.title}</span>
                  </div>
                  <BioButton variant="secondary" className="h-10 px-4 text-xs" onClick={() => addSuggestedLink(link)} disabled={!state}>
                    Add
                  </BioButton>
                </div>
              ))}
            </div>
          )}
        </BioCard>
      )}

      {activeTool === "button" && (
        <BioCard className="space-y-4">
          <h3 className="font-semibold text-bio-dark">AI CTA Generator</h3>
          <BioMuted className="text-xs">Turn generic platform names into strong call-to-action buttons.</BioMuted>
          <BioInput
            value={buttonPlatform}
            onChange={(e) => setButtonPlatform(e.target.value)}
            placeholder="Platform (e.g. Instagram, WhatsApp)"
          />
          {buttonPlatform.trim() && (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-bio-dark/10 bg-white p-4">
              <SocialIconBadge icon={resolveLinkIcon(null, buttonPlatform)} size={40} />
              <span className="text-sm text-bio-grey">Preview icon for {buttonPlatform}</span>
            </div>
          )}
          <BioButton onClick={generateButton} disabled={loading || !buttonPlatform.trim()} className="h-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <AiIcon className="size-4" />}
            Generate CTA
          </BioButton>
          {buttonText && (
            <div className="flex items-center justify-between rounded-2xl border-2 border-bio-dark/10 bg-white p-4">
              <span className="text-base text-bio-dark">{buttonText}</span>
              <BioButton
                variant="secondary"
                className="h-10 shrink-0 px-4 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(buttonText)
                  toast.success("Copied to clipboard!")
                }}
              >
                Copy
              </BioButton>
            </div>
          )}
        </BioCard>
      )}
    </div>
  )
}

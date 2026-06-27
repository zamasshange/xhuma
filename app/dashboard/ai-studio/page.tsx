"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api-fetch"
import { cn } from "@/lib/utils"

const TOOLS = [
  { id: "bio", title: "Bio Generator" },
  { id: "links", title: "Link Suggestions" },
  { id: "button", title: "Button Writer" },
] as const

export default function AiStudioPage() {
  const { profile, refreshProfile, refreshLinks } = useDashboard()
  const [activeTool, setActiveTool] = useState<(typeof TOOLS)[number]["id"]>("bio")
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
    const res = await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ bio }) })
    if (!res.success) {
      toast.error(res.error ?? "Could not apply bio")
      return
    }
    await refreshProfile()
    toast.success("Bio applied!")
  }

  const addLink = async (link: { title: string; url: string }) => {
    const res = await apiFetch("/api/links", { method: "POST", body: JSON.stringify(link) })
    if (!res.success) {
      toast.error(res.error ?? "Could not add link")
      return
    }
    await refreshLinks()
    toast.success(`${link.title} added!`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">AI Studio</h1>
        <p className="mt-1 text-muted-foreground">
          AI-powered tools for your page{profile ? ` (@${profile.username})` : ""}.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium min-h-[44px]",
              activeTool === tool.id ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground",
            )}
          >
            {tool.title}
          </button>
        ))}
      </div>

      {activeTool === "bio" && (
        <Card>
          <CardHeader>
            <CardTitle>AI Bio Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[120px] text-base"
              placeholder="Tell us about yourself — role, vibe, location..."
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
            />
            <Button onClick={generateBio} disabled={loading || !bioInput.trim()} className="h-11 bg-brand-gradient text-brand-foreground">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate Bio
            </Button>
            {bios.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {bios.map((bio, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <Badge variant="secondary" className="mb-2">Option {i + 1}</Badge>
                    <p className="text-sm leading-relaxed">{bio}</p>
                    <Button variant="outline" size="sm" className="mt-3 h-10 w-full" onClick={() => applyBio(bio)}>
                      Use this bio
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTool === "links" && (
        <Card>
          <CardHeader>
            <CardTitle>AI Link Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              className="h-12 text-base"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Your profession or bio snippet"
            />
            <Button onClick={generateLinks} disabled={loading || !profession.trim()} className="h-11 bg-brand-gradient text-brand-foreground">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Get Suggestions
            </Button>
            {suggestedLinks.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedLinks.map((link) => (
                  <div key={link.title} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <span className="font-medium">{link.title}</span>
                    <Button size="sm" variant="outline" className="h-10" onClick={() => addLink(link)}>
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTool === "button" && (
        <Card>
          <CardHeader>
            <CardTitle>AI Button Writer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              className="h-12 text-base"
              value={buttonPlatform}
              onChange={(e) => setButtonPlatform(e.target.value)}
              placeholder="Platform (e.g. Instagram)"
            />
            <Button onClick={generateButton} disabled={loading || !buttonPlatform.trim()} className="h-11 bg-brand-gradient text-brand-foreground">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate Copy
            </Button>
            {buttonText && (
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <span className="text-base">{buttonText}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(buttonText)
                    toast.success("Copied to clipboard!")
                  }}
                >
                  Copy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

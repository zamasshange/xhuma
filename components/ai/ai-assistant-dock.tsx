"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Loader2, MessageCircle, Send, X } from "lucide-react"
import { AiIcon } from "@/components/icons/app-icons"
import { useEditor } from "@/components/editor/editor-provider"
import { BioMuted } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"
import { buildEditorContextPayload } from "@/lib/ai/editor-context"
import type { EditorTabId } from "@/components/editor/editor-shell"
import { cn } from "@/lib/utils"

type Message = { role: "user" | "assistant"; content: string }

const STARTERS = [
  "How can I improve my bio?",
  "What links should I add?",
  "Help me pick a theme",
  "Make my page more professional",
]

export function AiAssistantDock({ tab }: { tab: EditorTabId }) {
  const { state, profile } = useEditor()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Xhuma AI assistant. I can see what you're editing and help with bios, links, themes, and layout.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = window.setTimeout(() => inputRef.current?.focus(), 150)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return
      const userMsg: Message = { role: "user", content: text.trim() }
      setMessages((m) => [...m, userMsg])
      setInput("")
      setLoading(true)

      const res = await apiFetch<{ reply: string }>("/api/ai/assistant", {
        method: "POST",
        body: JSON.stringify({
          message: text.trim(),
          context: {
            state,
            tab,
            username: profile?.username,
          },
          history: messages.filter((m) => m.role !== "assistant" || m.content !== messages[0]?.content),
        }),
      })

      setLoading(false)
      const reply =
        res.success && res.data
          ? res.data.reply
          : "AI is temporarily unavailable — try Quick Actions or edit manually."
      setMessages((m) => [...m, { role: "assistant", content: reply }])
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }))
    },
    [loading, messages, profile?.username, state, tab],
  )

  if (!state || !mounted) return null

  return createPortal(
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-[max(5rem,env(safe-area-inset-bottom))] right-3 z-[9000] flex size-14 items-center justify-center rounded-full bg-bio-dark text-white shadow-lg transition-transform hover:scale-105 sm:right-4 lg:bottom-6"
          aria-label="Open AI assistant"
        >
          <AiIcon className="size-6" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center p-3 pb-[max(5rem,env(safe-area-inset-bottom))] sm:items-end sm:justify-end sm:p-4 sm:pb-6"
          role="presentation"
        >
          {/* Backdrop — same stacking context, behind panel */}
          <div
            className="absolute inset-0 bg-bio-dark/30"
            aria-hidden
            onClick={() => setOpen(false)}
          />

          {/* Panel — explicit z-10 above backdrop */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant"
            className="relative z-10 flex w-full max-w-[380px] max-h-[min(72dvh,520px)] flex-col overflow-hidden rounded-xl border border-bio-dark/10 bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-bio-dark/6 bg-bio-grey-f4 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-bio-dark" />
                <span className="text-sm font-semibold text-bio-dark">AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg hover:bg-bio-dark/5 active:bg-bio-dark/10"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                    m.role === "user" ? "ml-auto bg-bio-dark text-white" : "bg-bio-grey-f4 text-bio-dark",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-bio-grey">
                  <Loader2 className="size-3 animate-spin" /> Thinking…
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-bio-dark/6 px-3 py-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="min-h-9 cursor-pointer rounded-lg bg-bio-grey-f4 px-2.5 py-1.5 text-left text-[11px] font-medium text-bio-grey active:bg-bio-dark/10 hover:text-bio-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              className="flex shrink-0 gap-2 border-t border-bio-dark/6 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                void send(input)
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                autoComplete="off"
                enterKeyHint="send"
                className="h-11 min-w-0 flex-1 rounded-lg border border-bio-dark/10 bg-white px-4 text-base text-bio-dark outline-none placeholder:text-bio-grey/70 focus:border-bio-dark/25 focus:ring-2 focus:ring-bio-dark/5"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-bio-dark text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>

            <BioMuted className="shrink-0 px-3 pb-2 text-center text-[10px]">
              Context: {buildEditorContextPayload(state, tab).link_count} links · {tab} tab
            </BioMuted>
          </div>
        </div>
      )}
    </>,
    document.body,
  )
}

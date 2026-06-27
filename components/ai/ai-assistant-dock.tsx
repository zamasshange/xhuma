"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Loader2, MessageCircle, Send, X } from "lucide-react"
import { AiIcon } from "@/components/icons/app-icons"
import { useEditor } from "@/components/editor/editor-provider"
import { BioButton, BioInput, BioMuted } from "@/components/ui/bio-form"
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

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(t)
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
          className="fixed bottom-[max(5rem,env(safe-area-inset-bottom))] right-3 z-[200] flex size-14 items-center justify-center rounded-full bg-bio-dark text-white shadow-lg transition-transform hover:scale-105 sm:right-4 lg:bottom-6"
          aria-label="Open AI assistant"
        >
          <AiIcon className="size-6" />
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[199] touch-manipulation bg-bio-dark/20"
            aria-label="Close AI assistant"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="AI Assistant"
            className="fixed bottom-[max(5rem,env(safe-area-inset-bottom))] left-3 right-3 z-[200] mx-auto flex max-h-[min(70dvh,520px)] w-auto max-w-[380px] flex-col overflow-hidden rounded-xl border border-bio-dark/10 bg-white shadow-2xl touch-manipulation sm:left-auto sm:right-4 lg:bottom-6"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-bio-dark/6 bg-bio-grey-f4 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-bio-dark" />
                <span className="text-sm font-semibold text-bio-dark">AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-bio-dark/5"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
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
              <div className="flex flex-wrap gap-1.5 border-t border-bio-dark/6 px-3 py-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-lg bg-bio-grey-f4 px-2.5 py-1.5 text-[11px] font-medium text-bio-grey hover:text-bio-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              className="flex gap-2 border-t border-bio-dark/6 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                void send(input)
              }}
            >
              <BioInput
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="h-11 min-w-0 flex-1 text-base"
                autoComplete="off"
              />
              <BioButton type="submit" className="h-11 w-11 shrink-0 p-0" disabled={loading || !input.trim()}>
                <Send className="size-4" />
              </BioButton>
            </form>

            <BioMuted className="px-3 pb-2 text-center text-[10px]">
              Context: {buildEditorContextPayload(state, tab).link_count} links · {tab} tab
            </BioMuted>
          </div>
        </>
      )}
    </>,
    document.body,
  )
}

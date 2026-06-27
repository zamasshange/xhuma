import type { ReactNode } from "react"
import type { Metadata } from "next"
import { EditorProvider } from "@/components/editor/editor-provider"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Editor",
  robots: NOINDEX_ROBOTS,
}

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <EditorProvider>{children}</EditorProvider>
    </div>
  )
}

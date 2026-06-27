import type { ReactNode } from "react"
import { EditorProvider } from "@/components/editor/editor-provider"

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <EditorProvider>{children}</EditorProvider>
    </div>
  )
}

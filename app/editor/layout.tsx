import type { ReactNode } from "react"
import type { Metadata } from "next"
import { EditorProvider } from "@/components/editor/editor-provider"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Customize Your Link in Bio",
  description:
    "Edit your Xhuma link in bio page with AI assistance. Update links, bio, themes, and branding — built for creators in South Africa and beyond.",
  path: "/editor",
  noIndex: true,
})

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="xhuma-site min-h-dvh bg-white text-bio-dark">
      <EditorProvider>{children}</EditorProvider>
    </div>
  )
}

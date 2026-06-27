import { Suspense } from "react"
import { PageEditor } from "@/components/editor/page-editor"

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center">Loading…</div>}>
      <PageEditor />
    </Suspense>
  )
}

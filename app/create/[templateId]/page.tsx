"use client"

import { useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { getUserId } from "@/lib/temp-user"
import { apiFetch } from "@/lib/api-fetch"
import { isTemplateId } from "@/data/templates"
import { stashPendingDraft } from "@/lib/client-draft"
import type { ProfileDraft } from "@/lib/database.types"

export default function CreateTemplatePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = String(params.templateId ?? "")
  const themeId = searchParams.get("theme") ?? undefined

  useEffect(() => {
    if (!isTemplateId(templateId)) return

    getUserId()
    stashPendingDraft(templateId, themeId)

    // Open editor immediately — never block on database
    router.replace(themeId ? `/editor?theme=${themeId}` : "/editor")

    // Sync draft to API in background (best-effort)
    void apiFetch<ProfileDraft>("/api/draft", {
      method: "PUT",
      body: JSON.stringify({ template_id: templateId }),
    })
  }, [templateId, themeId, router])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-4 text-bio-dark">
      <div className="size-10 animate-spin rounded-full border-2 border-bio-dark/20 border-t-bio-dark" />
      <p className="mt-4 text-sm text-bio-grey">Opening your template…</p>
    </div>
  )
}

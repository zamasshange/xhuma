"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getUserId } from "@/lib/temp-user"
import { apiFetch } from "@/lib/api-fetch"
import { isTemplateId } from "@/data/templates"
import { stashPendingDraft } from "@/lib/client-draft"
import type { ProfileDraft } from "@/lib/database.types"

function isDraftDbError(msg: string) {
  return (
    msg.includes("profile_drafts") ||
    msg.includes("templates") ||
    msg.includes("constraint") ||
    msg.includes("ON CONFLICT") ||
    msg.includes("relation") ||
    msg.includes("does not exist")
  )
}

export default function CreateTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const templateId = String(params.templateId ?? "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isTemplateId(templateId)) {
      setError("Unknown template")
      return
    }

    let cancelled = false

    ;(async () => {
      getUserId()
      const res = await apiFetch<ProfileDraft>("/api/draft", {
        method: "PUT",
        body: JSON.stringify({ template_id: templateId }),
      })

      if (cancelled) return

      if (!res.success) {
        const msg = res.error ?? "Could not start editor"
        if (isDraftDbError(msg)) {
          // Still open editor from static template while DB is being fixed
          stashPendingDraft(templateId)
          router.replace("/editor")
          return
        }
        setError(msg)
        return
      }

      router.replace("/editor")
    })()

    return () => {
      cancelled = true
    }
  }, [templateId, router])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-4 text-bio-dark">
      {error ? (
        <>
          <p className="text-lg font-semibold">{error}</p>
          <a href="/#templates" className="mt-4 text-sm font-semibold text-bio-grey underline">
            Back to templates
          </a>
        </>
      ) : (
        <>
          <div className="size-10 animate-spin rounded-full border-2 border-bio-dark/20 border-t-bio-dark" />
          <p className="mt-4 text-sm text-bio-grey">Loading your template…</p>
        </>
      )}
    </div>
  )
}

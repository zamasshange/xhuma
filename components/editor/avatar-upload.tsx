"use client"

import { useRef, useState } from "react"
import { Camera, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api-fetch"
import { cn } from "@/lib/utils"

export function AvatarUpload({
  avatarUrl,
  displayName,
  onUploaded,
}: {
  avatarUrl: string | null
  displayName: string
  onUploaded: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const shown = preview ?? avatarUrl
  const initials = (displayName || "You").slice(0, 2).toUpperCase()

  const handleFile = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB")
      return
    }

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    const form = new FormData()
    form.append("file", file)
    const res = await apiFetch<{ url: string }>("/api/upload/avatar", {
      method: "POST",
      body: form,
      headers: {},
    })

    setUploading(false)

    if (!res.success || !res.data?.url) {
      setPreview(null)
      toast.error(res.error ?? "Upload failed — try again")
      return
    }

    onUploaded(res.data.url)
    toast.success("Photo updated!")
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "group relative size-28 shrink-0 overflow-hidden rounded-full",
          "ring-4 ring-offset-4 ring-offset-white",
          "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500",
          "shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]",
          uploading && "pointer-events-none opacity-80",
        )}
        aria-label="Upload profile photo"
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-2xl font-bold text-white">
            {initials}
          </span>
        )}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-white" />
          ) : (
            <>
              <Camera className="size-6 text-white" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white">Change</span>
            </>
          )}
        </span>
      </button>

      <div className="text-center sm:text-left">
        <p className="flex items-center justify-center gap-1.5 text-base font-semibold text-bio-dark sm:justify-start">
          <Sparkles className="size-4 text-violet-500" />
          Profile photo
        </p>
        <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-bio-grey">
          This is the first thing visitors see. Tap the circle or use the button below.
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="bio-continue-btn mt-3 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : shown ? "Change photo" : "Upload photo"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0] ?? null)
          e.target.value = ""
        }}
      />
    </div>
  )
}

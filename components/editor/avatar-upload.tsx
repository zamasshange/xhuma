"use client"

import { useRef, useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api-fetch"
import { BioButton } from "@/components/ui/bio-form"
import { cn } from "@/lib/utils"

export function AvatarUpload({
  avatarUrl,
  displayName,
  onUploaded,
  onPreviewChange,
}: {
  avatarUrl: string | null
  displayName: string
  onUploaded: (url: string) => void
  /** Fires immediately when the user picks a file (blob URL) and after a successful upload */
  onPreviewChange?: (url: string | null) => void
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

    const blobUrl = URL.createObjectURL(file)
    setPreview(blobUrl)
    onPreviewChange?.(blobUrl)
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
      onPreviewChange?.(avatarUrl)
      toast.error(res.error ?? "Upload failed — try again")
      return
    }

    onUploaded(res.data.url)
    onPreviewChange?.(res.data.url)
    toast.success("Photo updated!")
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-bio-grey-d9 bg-bio-grey-f4 transition-colors hover:border-bio-dark/25",
          uploading && "pointer-events-none opacity-70",
        )}
        aria-label="Upload profile photo"
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-xl font-semibold text-bio-grey">{initials}</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-bio-dark/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-white" />
          ) : (
            <Camera className="size-6 text-white" />
          )}
        </span>
      </button>

      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold text-bio-dark">Profile photo</p>
        <p className="mt-1 text-sm text-bio-grey">JPG or PNG, up to 2MB</p>
        <BioButton
          type="button"
          variant="secondary"
          disabled={uploading}
          className="mt-3 h-10 px-4 text-xs"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : shown ? "Change photo" : "Upload photo"}
        </BioButton>
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

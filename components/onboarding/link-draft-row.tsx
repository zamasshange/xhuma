"use client"

import { memo } from "react"
import { SocialIconBadge, resolveLinkIcon } from "@/components/icons/social-icon"

type LinkDraftRowProps = {
  title: string
  url: string
  onTitleChange: (value: string) => void
  onUrlChange: (value: string) => void
}

export const LinkDraftRow = memo(function LinkDraftRow({
  title,
  url,
  onTitleChange,
  onUrlChange,
}: LinkDraftRowProps) {
  const icon = resolveLinkIcon(null, title, url)

  return (
    <div className="mb-3 flex gap-3 last:mb-0">
      <SocialIconBadge icon={icon} size={44} className="mt-1 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          className="h-12 w-full rounded-xl bg-bio-grey-f4 px-4 text-bio-dark outline-none placeholder:text-bio-grey"
          placeholder="Link name"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <input
          className="h-12 w-full rounded-xl bg-bio-grey-f4 px-4 text-bio-dark outline-none placeholder:text-bio-grey"
          placeholder="URL"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>
    </div>
  )
})

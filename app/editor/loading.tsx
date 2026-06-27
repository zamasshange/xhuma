import { LogoMark } from "@/components/marketing/biolink/logo-mark"

export default function EditorLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f7f7f8] text-bio-grey">
      <LogoMark height={28} maxWidth={118} />
      <p className="text-sm font-medium">Loading editor…</p>
    </div>
  )
}

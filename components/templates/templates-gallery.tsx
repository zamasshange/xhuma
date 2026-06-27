import Link from "next/link"
import { listTemplates } from "@/lib/templates-server"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { ThemePreviewImage } from "@/components/themes/theme-preview-image"

export async function TemplatesGallery() {
  const templates = await listTemplates()

  return (
    <section id="templates" className="pt-28 text-bio-dark max-lg:pt-16">
      <BioContainer>
        <div className="mb-5 text-center">
          <SectionBadge>Templates</SectionBadge>
        </div>
        <h2 className="text-center text-6xl font-semibold leading-tight tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Pick a template.
          <br />
          Make it yours.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-bio-grey max-sm:text-base">
          Start with a pre-built layout — customize everything in the editor, then claim your link.
        </p>
      </BioContainer>

      <div className="mt-12 px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/create/${t.id}`}
              className="group flex flex-col transition-transform hover:scale-[1.02]"
            >
              <div className="overflow-hidden rounded-2xl bg-bio-grey-f4 shadow-[0_4px_24px_rgba(13,12,34,0.06)] ring-1 ring-black/5 transition-shadow group-hover:shadow-[0_8px_32px_rgba(13,12,34,0.1)]">
                {t.preview_image ? (
                  <ThemePreviewImage src={t.preview_image} alt={t.name} />
                ) : (
                  <div className="aspect-[9/14] w-full bg-bio-grey-f4" />
                )}
              </div>
              <p className="mt-3 text-center text-base font-semibold">{t.name}</p>
              <p className="mt-1 text-center text-xs text-bio-grey">{t.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

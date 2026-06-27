import Link from "next/link"
import { bioThemes } from "@/data/bio-link"
import { BioContainer } from "@/components/marketing/biolink/bio-container"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { DarkButton } from "@/components/marketing/biolink/dark-button"
import { ThemePreviewImage } from "@/components/themes/theme-preview-image"

export function ThemesSection() {
  return (
    <section className="pt-28 text-bio-dark max-lg:pt-16">
      <BioContainer>
        <div className="mb-5 text-center">
          <SectionBadge>Customise your page</SectionBadge>
        </div>
        <h2 className="text-center text-6xl font-semibold leading-tight tracking-tighter max-lg:text-5xl max-sm:text-4xl">
          Create your custom AI
          <br />
          site in minutes
        </h2>
        <h5 className="mx-auto mt-4 max-w-2xl text-center text-lg font-normal max-sm:text-base">
          Choose from 15+ trending themes or create your own,
          <br className="hidden sm:inline" />
          add your links, and go live in seconds.
        </h5>
        <div className="mt-8 flex justify-center max-sm:mt-6">
          <DarkButton href="/editor" className="w-[220px] max-sm:w-[200px]">
            Get started for free
          </DarkButton>
        </div>
      </BioContainer>

      <div className="mt-14 max-md:mt-10">
        <div className="overflow-x-auto pb-4 no-scrollbar scroll-pl-5 sm:scroll-pl-6 md:scroll-pl-8 lg:scroll-pl-10">
          <div className="flex w-max gap-4 px-5 sm:px-6 md:px-8 lg:px-10">
            {bioThemes.map((theme) => (
              <Link
                key={theme.id}
                href="/editor"
                className="w-[200px] shrink-0 transition-transform hover:scale-[1.02] max-sm:w-[180px]"
              >
                <ThemePreviewImage
                  src={theme.image}
                  alt={theme.name}
                  className="drop-shadow-[0_8px_30px_rgba(13,12,34,0.08)]"
                />
                <p className="mt-3 text-center text-sm font-medium">{theme.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

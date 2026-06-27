import { bioComparison, bioPricing, BIO_ASSETS } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { DarkButton, ArrowIcon } from "@/components/marketing/biolink/dark-button"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { SITE_NAME } from "@/lib/brand"
import { formatCurrency } from "@/lib/locale"

const totalElsewhere = bioComparison.reduce((sum, item) => sum + item.price, 0)

function DashedRule() {
  return (
    <svg className="relative mx-auto w-full max-w-[501px] max-sm:w-[92%]" height="2" viewBox="0 0 501 2" fill="none" aria-hidden="true">
      <line x1="1.5" y1="1" x2="499.5" y2="1" stroke="black" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="8 8" />
    </svg>
  )
}

export function CompareSection() {
  return (
    <section className="bg-white pt-28 max-lg:pt-20">
      <div className="mb-5 text-center">
        <SectionBadge>Compare</SectionBadge>
      </div>
      <h2 className="text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        All you need, in one place
      </h2>
      <p className="mx-auto mt-4 max-w-md text-center text-lg font-normal text-bio-dark max-sm:w-[90%] max-sm:text-base">
        Why juggle apps when one does it all?
      </p>

      <div className="relative m-auto mt-10 w-[min(560px,97%)] pb-8 pt-6">
        {/* Receipt paper texture */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BIO_ASSETS}/simpler-solution.ts4TUiVH.png`}
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-fill"
          aria-hidden
        />
        {/* Tape */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BIO_ASSETS}/simpler-solution-top.0-AB4aS_.png`}
          alt=""
          className="pointer-events-none absolute -top-5 left-1/2 h-[45px] w-auto max-w-[90%] -translate-x-1/2"
          aria-hidden
        />

        <DashedRule />

        <div className="relative mx-auto my-6 w-[min(420px,88%)] space-y-5 max-sm:my-5 max-sm:space-y-4">
          {bioComparison.map((item) => (
            <div key={item.title} className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm ring-1 ring-black/5 max-sm:size-8 max-sm:text-base">
                  {item.icon}
                </span>
                <div>
                  <h6 className="text-base font-semibold leading-snug text-bio-dark max-sm:text-sm">
                    {item.title}
                  </h6>
                  <p className="mt-0.5 text-[13px] font-light text-bio-grey max-sm:text-xs">{item.replaces}</p>
                </div>
              </div>
              <p className="shrink-0 pt-0.5 text-lg font-semibold text-bio-dark max-sm:text-base">{formatCurrency(item.price)}</p>
            </div>
          ))}
        </div>

        <DashedRule />

        <div className="relative mx-auto mt-5 flex w-[min(420px,88%)] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-lg text-bio-red" aria-hidden>
              ✕
            </span>
            <p className="text-base text-bio-grey line-through max-sm:text-sm">What you&apos;d spend otherwise</p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-bio-red line-through max-sm:text-base">
            {formatCurrency(totalElsewhere)}/mo
          </p>
        </div>

        <div className="relative mx-auto mt-4 flex w-[min(420px,88%)] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <LogoMark href="#" height={24} maxWidth={100} className="shrink-0" />
            <p className="text-base font-medium text-bio-dark max-sm:text-sm">
              Get everything with {SITE_NAME}
            </p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-bio-green max-sm:text-base">
            {formatCurrency(bioPricing.yearly)}/mo
          </p>
        </div>

        <DarkButton href="/sign-up" className="mx-auto mt-8 w-[min(420px,88%)]">
          Start my free trial
          <ArrowIcon />
        </DarkButton>
      </div>
    </section>
  )
}

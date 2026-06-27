import { bioComparison, bioPricing, BIO_ASSETS } from "@/data/bio-link"
import { SectionBadge } from "@/components/marketing/biolink/section-badge"
import { DarkButton, ArrowIcon } from "@/components/marketing/biolink/dark-button"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"

const totalElsewhere = bioComparison.reduce((sum, item) => sum + item.price, 0)

export function CompareSection() {
  return (
    <section className="pt-28 max-lg:pt-24">
      <div className="mb-5 text-center">
        <SectionBadge>Compare</SectionBadge>
      </div>
      <h1 className="text-center text-6xl font-semibold tracking-tighter text-bio-dark max-lg:text-5xl max-sm:px-2 max-sm:text-4xl">
        All you need, in one place
      </h1>
      <h5 className="mx-auto mt-4 max-w-md text-center text-lg font-normal text-bio-dark max-sm:w-[90%] max-sm:text-base">
        Why juggle apps when one does it all?
      </h5>

      <div className="relative m-auto mt-10 w-[min(560px,97%)] py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BIO_ASSETS}/simpler-solution.ts4TUiVH.png`} alt="" className="absolute left-0 top-0 -z-10 h-full w-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BIO_ASSETS}/simpler-solution-top.0-AB4aS_.png`}
          alt=""
          className="absolute -top-5 left-0 right-0 mx-auto h-[45px]"
        />

        <svg className="relative mx-auto max-sm:w-11/12" width="501" height="2" viewBox="0 0 501 2" fill="none" aria-hidden="true">
          <line x1="1.5" y1="1" x2="499.5" y2="1" stroke="black" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="8 8" />
        </svg>

        <div className="relative mx-auto my-5 w-4/5 space-y-4 max-sm:my-4 max-sm:w-[90%]">
          {bioComparison.map((item) => (
            <div key={item.title} className="flex justify-between gap-4">
              <div className="flex min-w-0">
                <span className="mr-3 mt-2 inline-block size-7 shrink-0 rounded-lg bg-bio-grey max-sm:size-5" />
                <div>
                  <h6 className="text-base font-semibold text-bio-dark">{item.title}</h6>
                  <p className="mt-0.5 text-[13px] font-light text-bio-grey">{item.replaces}</p>
                </div>
              </div>
              <p className="shrink-0 text-lg font-semibold text-bio-dark max-sm:text-base">${item.price}</p>
            </div>
          ))}
        </div>

        <svg className="relative mx-auto max-sm:w-11/12" width="501" height="2" viewBox="0 0 501 2" fill="none" aria-hidden="true">
          <line x1="1.5" y1="1" x2="499.5" y2="1" stroke="black" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="8 8" />
        </svg>

        <div className="relative mx-auto mt-4 flex w-4/5 items-center justify-between max-sm:mt-4 max-sm:w-[90%]">
          <p className="text-lg text-bio-grey line-through max-sm:text-base">What you&apos;d spend otherwise</p>
          <p className="text-lg font-semibold text-bio-red line-through max-sm:text-base">${totalElsewhere}/mo</p>
        </div>
        <div className="relative mx-auto mt-5 flex w-4/5 items-center justify-between max-sm:mt-4 max-sm:w-[90%]">
          <div className="flex items-center gap-3">
            <LogoMark href="#" height={24} />
            <p className="text-lg text-bio-dark max-sm:text-base">Get everything with Linkly</p>
          </div>
          <p className="text-lg font-semibold text-bio-green max-sm:text-base">${bioPricing.yearly.toFixed(2)}/mo</p>
        </div>

        <DarkButton href="/editor" className="mx-auto mt-8 w-4/5 max-sm:w-[90%]">
          Start my free trial
          <ArrowIcon />
        </DarkButton>
      </div>
    </section>
  )
}

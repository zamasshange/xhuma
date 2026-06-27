import { absoluteUrl } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export type BreadcrumbItem = { label: string; href: string }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }

  return <JsonLd data={data} />
}

/** Screen-reader breadcrumbs + JSON-LD for marketing subpages */
export function SeoBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

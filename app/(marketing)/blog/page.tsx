import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { BlogCard } from "@/components/cards/blog-card"
import { blogPosts, BLOG_CATEGORIES } from "@/data/marketing"
import { pageMetadata } from "@/lib/seo"
import { SeoBreadcrumbs } from "@/components/seo/breadcrumb-json-ld"

export const metadata = pageMetadata("blog")

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />
      <h1 className="sr-only">Xhuma Creator Blog — Link in Bio Guides &amp; Tips</h1>
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Insights for creators"
          description="Tips, trends, and strategies to grow your audience and make your Link in Bio work harder."
          align="left"
        />
      </Reveal>
      <nav aria-label="Blog categories" className="mt-6 flex flex-wrap gap-2">
        {BLOG_CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-bio-grey-f4 px-3 py-1 text-xs font-medium text-bio-grey"
          >
            {cat}
          </span>
        ))}
      </nav>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.05}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

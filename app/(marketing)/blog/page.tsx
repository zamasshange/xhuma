import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { BlogCard } from "@/components/cards/blog-card"
import { blogPosts } from "@/data/marketing"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata("blog")

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Insights for creators"
          description="Tips, trends, and strategies to grow your audience and make your Link in Bio work harder."
          align="left"
        />
      </Reveal>
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

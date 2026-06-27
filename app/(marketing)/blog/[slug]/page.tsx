import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { getBlogPost, blogPosts } from "@/data/marketing"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Button render={<Link href="/blog" />} variant="ghost" className="mb-6 -ml-2">
        <ArrowLeft className="size-4" />
        Back to blog
      </Button>

      <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover} alt="" className="size-full object-cover" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" />
          {post.readingTime}
        </span>
      </div>

      <h1 className="font-heading mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
        <Avatar src={post.author.avatar} alt={post.author.name} className="size-10" />
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">{post.date}</p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <p className="mt-6 text-base leading-relaxed">
          Building a high-converting Link in Bio page is one of the most underrated growth levers for creators today.
          Your bio is often the first impression — and the last click — before someone decides to follow, subscribe, or buy.
        </p>
        <p className="mt-4 text-base leading-relaxed">
          In this guide, we break down the patterns that top performers use: clear hierarchy, benefit-driven copy,
          strategic link ordering, and mobile-first design that feels native on every device.
        </p>
        <h2 className="font-heading mt-10 text-2xl font-semibold">Start with clarity</h2>
        <p className="mt-4 text-base leading-relaxed">
          Your headline should answer one question in under five seconds: what do you do, and why should I care?
          AI tools like Linkly&apos;s Bio Generator can produce three on-brand variants — professional, friendly, and creator —
          so you can A/B test without the blank-page anxiety.
        </p>
        <h2 className="font-heading mt-10 text-2xl font-semibold">Design for thumbs</h2>
        <p className="mt-4 text-base leading-relaxed">
          Over 70% of Link in Bio traffic comes from mobile. Large touch targets, full-width buttons, and comfortable
          spacing aren&apos;t nice-to-haves — they&apos;re conversion requirements. Every Linkly page is built mobile-first,
          then enhanced for tablet and desktop.
        </p>
      </div>
    </article>
  )
}

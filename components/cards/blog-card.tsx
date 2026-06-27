import Link from "next/link"
import { Clock } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {post.readingTime}
            </span>
          </div>
          <h3 className="font-heading mt-3 text-lg font-semibold leading-snug group-hover:text-brand">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2.5">
            <Avatar src={post.author.avatar} alt={post.author.name} className="size-8" />
            <div className="text-xs">
              <div className="font-medium">{post.author.name}</div>
              <div className="text-muted-foreground">{post.date}</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

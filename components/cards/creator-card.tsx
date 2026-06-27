import Link from "next/link"
import type { ExploreCard } from "@/data/explore"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function CreatorCard({ card }: { card: ExploreCard }) {
  return (
    <Link href={`/${card.username}`} className="group block">
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div
          className="relative flex h-28 items-end p-4"
          style={{ background: `linear-gradient(135deg, ${card.accent}40, ${card.accent}10)` }}
        >
          <Badge variant="secondary" className="absolute right-3 top-3">
            {card.category}
          </Badge>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.avatar}
            alt={card.name}
            className="size-14 rounded-full border-2 border-background object-cover shadow-md transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold group-hover:text-brand">{card.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{card.headline}</p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">{card.followers} followers</p>
        </div>
      </Card>
    </Link>
  )
}

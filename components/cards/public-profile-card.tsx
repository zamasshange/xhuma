import Link from "next/link"
import type { DbProfile } from "@/lib/database.types"
import { SITE_DOMAIN } from "@/lib/brand"

export function PublicProfileCard({
  profile,
}: {
  profile: Pick<DbProfile, "username" | "display_name" | "bio" | "avatar_url" | "theme_json">
}) {
  const accent = profile.theme_json?.button ?? "#0d0c22"

  return (
    <Link href={`/${profile.username}`} className="group block">
      <div className="overflow-hidden rounded-3xl bg-bio-grey-f4 transition-all hover:-translate-y-1 hover:shadow-lg">
        <div
          className="relative flex h-28 items-end p-4"
          style={{ background: `linear-gradient(135deg, ${accent}30, ${accent}08)` }}
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="size-14 rounded-full border-2 border-white object-cover shadow-md transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              className="flex size-14 items-center justify-center rounded-full border-2 border-white text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: accent }}
            >
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-bio-dark group-hover:underline">{profile.display_name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-bio-grey">
            {profile.bio || `Visit ${SITE_DOMAIN}/${profile.username}`}
          </p>
          <p className="mt-2 text-xs font-medium text-bio-grey">@{profile.username}</p>
        </div>
      </div>
    </Link>
  )
}

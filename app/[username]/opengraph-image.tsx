import { ImageResponse } from "next/og"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfile } from "@/lib/database.types"

export const runtime = "edge"
export const alt = "Xhuma creator profile"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function ProfileOgImage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  let displayName = username
  let bio = "AI-powered link in bio on Xhuma"

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("profiles")
      .select("display_name, bio")
      .eq("username", username.toLowerCase())
      .maybeSingle()
    if (data) {
      const profile = mapProfile(data as Record<string, unknown>)
      displayName = profile.display_name
      if (profile.bio) bio = profile.bio.slice(0, 120)
    }
  } catch {
    /* fallback text */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d0c22 0%, #1a1635 50%, #2d1f5c 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em", textAlign: "center" }}>
          {displayName}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {bio}
        </div>
        <div style={{ marginTop: 36, fontSize: 22, color: "rgba(255,255,255,0.55)" }}>
          xhuma.cc/{username}
        </div>
      </div>
    ),
    { ...size },
  )
}

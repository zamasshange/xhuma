import { ImageResponse } from "next/og"
import { SITE_NAME } from "@/lib/brand"

export const runtime = "edge"
export const alt = `${SITE_NAME} — AI link in bio`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
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
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>{SITE_NAME}</div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.3,
          }}
        >
          Your entire online presence, powered by AI
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          xhuma.cc
        </div>
      </div>
    ),
    { ...size },
  )
}

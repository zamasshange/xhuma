/**
 * Export theme backgrounds to public/backgrounds/ at live-page resolution.
 * Run: node scripts/export-backgrounds.mjs
 */
import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const srcDir = path.join(root, "lib", "images")
const outDir = path.join(root, "public", "backgrounds")

/** Minimum width for full-viewport backgrounds (bio.link recommends 1440px) */
const TARGET_WIDTH = 1440

const PRESET_SOURCES = {
  summer: "back1.avif",
  retro: "back2.avif",
  xmas: "back3.avif",
  basic: "back4.avif",
  rainy: "back5.jpg",
  strawberry: "back6.avif",
  chameleon: "back7.jpg",
  pride: "back8.avif",
  desert: "back9.avif",
  carbon: "back10.jpg",
  neon: "back11.jpg",
  minimal: "back12.avif",
}

fs.mkdirSync(outDir, { recursive: true })

for (const [preset, filename] of Object.entries(PRESET_SOURCES)) {
  const input = path.join(srcDir, filename)
  const output = path.join(outDir, `${preset}.webp`)
  const meta = await sharp(input).metadata()
  const needsUpscale = (meta.width ?? 0) < TARGET_WIDTH

  let pipeline = sharp(input)
  if (needsUpscale) {
    pipeline = pipeline.resize(TARGET_WIDTH, null, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
  } else if ((meta.width ?? 0) > 3000) {
    pipeline = pipeline.resize(3000, null, { fit: "inside", withoutEnlargement: true })
  }

  if (needsUpscale) {
    pipeline = pipeline.sharpen({ sigma: 0.8 })
  }

  await pipeline.webp({ quality: 92, effort: 6 }).toFile(output)
  const outMeta = await sharp(output).metadata()
  const outSize = fs.statSync(output).size
  console.log(
    `${preset}: ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height} (${Math.round(outSize / 1024)}KB)${needsUpscale ? " [upscaled]" : ""}`,
  )
}

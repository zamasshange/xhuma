import { z } from "zod"
import { isValidHttpUrl, isValidLinkUrl, normalizeUrl } from "@/lib/normalize-url"

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_-]+$/, "Username must be lowercase letters, numbers, _ or -")

export const profileThemeSchema = z.object({
  bg: z.string(),
  text: z.string(),
  button: z.string(),
  radius: z.string(),
  button_text: z.string().optional(),
  button_style: z.enum(["rounded", "wavy", "pill"]).optional(),
  link_style: z.string().optional(),
  social_icon_style: z.enum(["brand", "theme"]).optional(),
  bg_image: z.string().optional().nullable(),
  preset_id: z.string().optional().nullable(),
  page_sections: z.array(z.record(z.string(), z.unknown())).optional(),
})

export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  display_name: z.string().min(1).max(80).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional().nullable(),
  theme: profileThemeSchema.optional(),
})

export const profileCreateSchema = z.object({
  username: usernameSchema,
  display_name: z.string().min(1).max(80),
  bio: z.string().max(500).optional(),
})

const linkUrlSchema = z
  .string()
  .min(1, "URL is required")
  .transform(normalizeUrl)
  .refine(isValidLinkUrl, "Enter a valid URL (https://…, mailto:, or tel:)")

const optionalLinkUrlSchema = z
  .string()
  .optional()
  .transform((v) => (v?.trim() ? normalizeUrl(v) : undefined))
  .refine((v) => v === undefined || isValidLinkUrl(v), "Enter a valid URL")

export const linkCreateSchema = z.object({
  title: z.string().min(1).max(120),
  url: linkUrlSchema,
  icon: z.string().max(40).optional().nullable(),
})

export const linkUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120).optional(),
  url: optionalLinkUrlSchema,
  icon: z.string().max(40).optional().nullable(),
  is_active: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

export const linksReorderSchema = z.object({
  links: z.array(z.object({ id: z.string().uuid(), position: z.number().int().min(0) })),
})

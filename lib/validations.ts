import { z } from "zod"

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_-]+$/, "Username must be lowercase letters, numbers, _ or -")

export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  display_name: z.string().min(1).max(80).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional().nullable(),
  theme: z
    .object({
      bg: z.string(),
      text: z.string(),
      button: z.string(),
      radius: z.string(),
    })
    .optional(),
})

export const profileCreateSchema = z.object({
  username: usernameSchema,
  display_name: z.string().min(1).max(80),
  bio: z.string().max(500).optional(),
})

export const linkCreateSchema = z.object({
  title: z.string().min(1).max(120),
  url: z
    .string()
    .min(1, "URL is required")
    .refine((value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }, "Enter a valid URL (e.g. https://open.spotify.com)"),
  icon: z.string().max(40).optional().nullable(),
})

export const linkUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120).optional(),
  url: z.string().url().optional(),
  icon: z.string().max(40).optional().nullable(),
  is_active: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

export const linksReorderSchema = z.object({
  links: z.array(z.object({ id: z.string().uuid(), position: z.number().int().min(0) })),
})

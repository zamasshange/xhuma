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
      style: z.enum(["rounded", "pill", "square"]),
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
  url: z.string().url(),
})

export const linkUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120).optional(),
  url: z.string().url().optional(),
  is_active: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

export const linksReorderSchema = z.object({
  links: z.array(z.object({ id: z.string().uuid(), position: z.number().int().min(0) })),
})

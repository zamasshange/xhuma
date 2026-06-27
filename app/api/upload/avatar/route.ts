import { createAdminClient, requireUserId } from "@/lib/supabase/admin"
import { apiSuccess, apiError } from "@/lib/api-response"

export async function POST(request: Request) {
  const userId = await requireUserId(request)
  if (typeof userId === "object") return apiError(userId.error, 401)

  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File)) return apiError("No file provided", 400)
  if (!file.type.startsWith("image/")) return apiError("File must be an image", 400)
  if (file.size > 2 * 1024 * 1024) return apiError("Image must be under 2MB", 400)

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "png"
  const path = `${userId}/avatar.${ext}`

  const supabase = createAdminClient()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  })
  if (uploadError) return apiError(uploadError.message, 500)

  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  return apiSuccess({ url: data.publicUrl })
}

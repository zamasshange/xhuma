import { z } from "zod"
import { apiError, apiSuccess } from "@/lib/api-response"
import { COMPANY } from "@/lib/company"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError("Invalid request body", 400)
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid form data", 400)
  }

  const { name, email, subject, message } = parsed.data
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? "Xhuma <onboarding@resend.dev>"

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [COMPANY.email],
        reply_to: email,
        subject: `[Xhuma Contact] ${subject}`,
        html: `
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[contact] Resend error:", err)
      return apiError("Could not send message. Please email us directly.", 500)
    }

    return apiSuccess({ sent: true })
  }

  console.info("[contact] (no RESEND_API_KEY)", { name, email, subject, message })
  return apiSuccess({ sent: true, logged: true })
}

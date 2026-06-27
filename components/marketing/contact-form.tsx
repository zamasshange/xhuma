"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { BioButton, BioInput, BioTextarea } from "@/components/ui/bio-form"
import { apiFetch } from "@/lib/api-fetch"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await apiFetch<{ sent: boolean; logged?: boolean }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!res.success) {
      toast.error(res.error ?? "Could not send message")
      return
    }
    toast.success("Message sent! We typically respond within 24–48 hours.")
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-bio-dark">
            Name
          </label>
          <BioInput id="name" placeholder="Your name" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-bio-red">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-bio-dark">
            Email
          </label>
          <BioInput id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-bio-red">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-bio-dark">
          Subject
        </label>
        <BioInput id="subject" placeholder="How can we help?" {...register("subject")} />
        {errors.subject && <p className="mt-1 text-xs text-bio-red">{errors.subject.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-bio-dark">
          Message
        </label>
        <BioTextarea id="message" className="min-h-[140px]" placeholder="Tell us more…" {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-bio-red">{errors.message.message}</p>}
      </div>
      <BioButton type="submit" disabled={isSubmitting} className="h-12 w-full sm:w-auto sm:px-8">
        {isSubmitting ? "Sending…" : "Send message"}
      </BioButton>
    </form>
  )
}

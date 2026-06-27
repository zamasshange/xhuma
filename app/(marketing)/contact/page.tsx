"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Mail, MessageSquare, User } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { SITE_DOMAIN } from "@/lib/brand"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = () => {
    toast.success("Message sent! We'll get back to you within 24 hours.")
    reset()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Questions about Xhuma, partnerships, or Business plans? Drop us a line — we're based in South Africa and reply within one business day."
          align="left"
        />
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {[
            { icon: Mail, title: "Email", value: "hello@xhuma.cc" },
            { icon: MessageSquare, title: "Live chat", value: "Mon–Fri, 9am–5pm SAST" },
            { icon: User, title: "Support", value: `${SITE_DOMAIN}/faq` },
          ].map((item) => (
            <Card key={item.title} className="flex items-center gap-4 p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Reveal className="lg:col-span-3">
          <Card className="p-5 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" className="h-12 text-base" placeholder="Your name" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="h-12 text-base"
                    placeholder="you@example.co.za"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" className="h-12 text-base" placeholder="How can we help?" {...register("subject")} />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="min-h-[140px] text-base"
                  placeholder="Tell us more..."
                  {...register("message")}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 min-h-11 w-full text-base bg-brand-gradient text-brand-foreground sm:w-auto sm:px-8"
              >
                Send message
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}

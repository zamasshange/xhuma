import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function AuthContinuePage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const supabase = createAdminClient()
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

  if (profile) redirect("/editor")
  redirect("/onboarding")
}

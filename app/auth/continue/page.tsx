import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function AuthContinuePage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  try {
    const supabase = createAdminClient()
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (!error && profile) redirect("/editor")
  } catch {
    // Supabase misconfigured — still send user to onboarding
  }

  redirect("/onboarding")
}

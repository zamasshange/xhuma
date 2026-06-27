"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const router = useRouter()
  const { profile } = useDashboard()
  const [email, setEmail] = useState("")

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? ""))
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out")
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <div className="flex items-center gap-4">
              <Avatar src={profile.avatar_url ?? undefined} alt={profile.display_name} className="size-14" />
              <div>
                <p className="font-medium">{profile.display_name}</p>
                <p className="text-sm text-muted-foreground">xhuma.io/{profile.username}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{email || "—"}</p>
          </div>
          <Button variant="outline" className="h-11" onClick={signOut}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

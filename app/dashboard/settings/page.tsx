"use client"

import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_DOMAIN } from "@/lib/brand"

export default function SettingsPage() {
  const { profile, userId } = useDashboard()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Your device is linked to this page. No login required yet.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your device ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Stored in your browser so you can edit your page on this device.
          </p>
          <code className="block break-all rounded-lg bg-muted p-3 text-xs">{userId}</code>
          {profile && (
            <p>
              Public page:{" "}
              <a href={`/${profile.username}`} className="font-medium text-brand hover:underline">
                {SITE_DOMAIN}/{profile.username}
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

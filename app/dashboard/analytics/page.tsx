import { redirect } from "next/navigation"

export default function DashboardAnalyticsRedirect() {
  redirect("/editor?tab=analytics")
}

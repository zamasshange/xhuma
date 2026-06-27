import { redirect } from "next/navigation"

export default function DashboardAiRedirect() {
  redirect("/editor?tab=ai")
}

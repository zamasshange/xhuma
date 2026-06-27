import { Suspense } from "react"
import LoginPage from "./login-page"

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center">Loading…</div>}>
      <LoginPage />
    </Suspense>
  )
}
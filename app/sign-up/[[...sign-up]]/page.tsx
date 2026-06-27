import { SignUp } from "@clerk/nextjs"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { clerkAppearance } from "@/lib/clerk-appearance"

export default function SignUpPage() {
  return (
    <div className="xhuma-site flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-4 py-10">
      <LogoMark height={32} maxWidth={136} className="mb-8" />
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/auth/continue"
      />
    </div>
  )
}

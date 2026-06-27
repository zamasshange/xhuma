import { SignIn } from "@clerk/nextjs"
import { LogoMark } from "@/components/marketing/biolink/logo-mark"
import { clerkAppearance } from "@/lib/clerk-appearance"

export default function SignInPage() {
  return (
    <div className="xhuma-site flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f8] px-4 py-10">
      <LogoMark height={36} className="mb-8" />
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/auth/continue"
      />
    </div>
  )
}

import { ClerkProvider, ClerkFailed, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { ClerkFailedScreen } from "@/components/auth/clerk-failed-screen"
import { clerkProviderProps } from "@/lib/clerk-config"
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xhuma — Your Entire Online Presence, Powered by AI',
  description:
    'Xhuma is the AI-powered Link in Bio platform that helps creators build a beautiful, high-converting page in minutes.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} xhuma-site`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased text-bio-dark bg-white">
        <ClerkProvider {...clerkProviderProps}>
          <ClerkLoading>
            <div className="flex min-h-dvh items-center justify-center bg-[#f7f7f8] text-bio-grey">
              Loading…
            </div>
          </ClerkLoading>
          <ClerkFailed>
            <ClerkFailedScreen />
          </ClerkFailed>
          <ClerkLoaded>
            <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
              {children}
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </ClerkLoaded>
        </ClerkProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

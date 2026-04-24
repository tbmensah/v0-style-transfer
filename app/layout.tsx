import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/components/query-provider'
import { SupabaseAuthProvider } from '@/components/supabase-auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AdjustAid - Automated Claims Estimating',
  description: 'Generate accurate NFIP estimates in minutes, not hours. Upload your files or enter site details, and receive estimate-ready ESX outputs powered by intelligent automation.',
  generator: 'v0.app',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
          </QueryProvider>
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F4F4A',
}

export const metadata: Metadata = {
  title: "Anywork365 – Nigeria's Work Platform",
  description: 'Connect with verified artisans, technicians, and vendors across Nigeria.',
  keywords: ['Nigeria', 'freelance', 'artisans', 'technicians', 'vendors', 'Lagos', 'Abuja'],
  openGraph: {
    title: 'Anywork365',
    description: 'Find skilled vendors for any job in Nigeria',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-body bg-ui-bg text-text-primary antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}

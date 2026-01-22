import React from "react"
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Ale & Clari - Wedding',
  description: 'Join us for our special day - March 14, 2026',
  openGraph: {
    title: 'Ale & Clari - Wedding',
    description: 'Join us for our special day - March 14, 2026',
    images: [
      {
        url: '/images/wheat-field.jpg',
        width: 1200,
        height: 630,
        alt: 'Ale & Clari Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ale & Clari - Wedding',
    description: 'Join us for our special day - March 14, 2026',
    images: ['/images/wheat-field.jpg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

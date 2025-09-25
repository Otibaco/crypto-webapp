import React from "react"
import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import "./globals.css"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Suspense } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono =
 Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "CryptoWallet",
  description: "Modern cryptocurrency wallet with DeFi features",
  
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true">
        <div className="min-h-screen bg-background">
          <main className="pb-20">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
          <BottomNavigation />
        </div>
        <Analytics />
      </body>
    </html>
  )
}

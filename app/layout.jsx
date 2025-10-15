import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "2$weet - Professional Crypto Exchange & Trading Platform",
  description:
    "Trade cryptocurrencies with confidence on 2$weet. Professional trading platform with advanced features, security, and mobile app.",
  keywords:
    "cryptocurrency, crypto exchange, bitcoin, trading, blockchain, digital assets",
  icons: {
    icon: "/logo.jpg",        // Favicon (shows in browser tab)
    shortcut: "/logo.jpg",    // Safari/old browsers
    apple: "/logo.jpg",       // iOS home screen icon
  },
  openGraph: {
    images: ["/logo.jpg"],    // For link previews (FB, Twitter, WhatsApp)
  },
};


export default async function RootLayout({
  children,
}) {


  return (
    <html lang="en" className="dark">
      
      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        
        
          <div className="min-h-screen bg-background">
            <main className="pb-20">
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </main>
          </div>
      </body>
    </html>
  );
}


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import ContextProvider from "../context";
import { headers } from "next/headers";


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
    icon: "/logo2.png",        // Favicon (shows in browser tab)
    shortcut: "/logo2.png",    // Safari/old browsers
    apple: "/logo2.png",       // iOS home screen icon
  },
  openGraph: {
    images: ["/logo2.png"],    // For link previews (FB, Twitter, WhatsApp)
  },
};


export default async function RootLayout({
  children,
}) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");

  return (
    <html lang="en" className="dark">

      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >

        <ContextProvider cookies={cookies}>

          <div className="min-h-screen bg-background">
            <main className="pb-20">
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </main>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}


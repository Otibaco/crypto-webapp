import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Suspense } from "react";
import { headers } from "next/headers"; // ✅ import this
import { ContextProvider } from "@/context/ContextProvider"; // ✅ make sure this path is correct

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const headersList = headers();
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
        <Analytics />
      </body>
    </html>
  );
}

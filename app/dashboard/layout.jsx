import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Suspense } from "react";




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
        
        {/* Wrap the entire app with the ContextProvider */}
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


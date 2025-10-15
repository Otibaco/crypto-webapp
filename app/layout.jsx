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
  title: "CryptoWallet",
  description: "Modern cryptocurrency wallet with DeFi features",
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


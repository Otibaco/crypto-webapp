"use client"

import { Button } from "../components/ui/button"
import { ArrowRight, Wallet, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import CustomAppKitButton from "../components/CustomAppKitButton"
import { AppDownload } from "../components/app-download"
import Link from "next/link"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    // Adjusted padding for mobile and used lg:min-h-screen for desktop
    <section className="relative pt-24 pb-12 flex items-center justify-center overflow-hidden lg:min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
        {/* Responsive sizing for animated background elements to prevent mobile overflow */}
        <div className="absolute top-10 left-5 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
        <div
          className="absolute bottom-10 right-5 w-64 h-64 sm:w-80 sm:h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-neon"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse-neon"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/4 right-1/4 w-12 h-12 sm:w-16 sm:h-16 animate-float opacity-20">
          <Image src="/bitcoin-icons.png" alt="icons" width={64} height={64} className="rounded-full" />
        </div>
        <div
          className="absolute bottom-1/3 left-1/4 w-8 h-8 sm:w-12 sm:h-12 animate-float opacity-15"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-xs font-bold">
            ETH
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {/* Responsive Heading Size */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance glow-text">
            Experience the Power of <span className="gradient-text">Decentralized Finance</span>
          </h1>
          {/* Responsive Paragraph Size and Width */}
          <p className="text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty">
            Experience the power of decentralized finance on Ethereum — simple, secure, and transparent. Connect your
            wallet and take control of your crypto.
          </p>

          {/* Button Group: Stacks on mobile, inline on sm (small screens/tablets) and up */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0 w-full max-w-3xl mx-auto">

            {/* Wallet Connect */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
              <CustomAppKitButton />

            </div>

            {/* Learn More Button */}
            <Link href="/#features">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 neon-border hover:text-[#00e200] bg-transparent transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button></Link>

          </div>


          <div className="mb-10 sm:mb-16">
            <AppDownload />
          </div>

          {/* Feature Grid: Stacks on mobile (grid-cols-1), transitions to 2-col on small, 3-col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-float crypto-card p-4 rounded-lg text-center sm:text-left">
              <Wallet className="h-7 w-7 text-accent flex-shrink-0" />
              <div>
                <div className="text-xl font-bold text-foreground">Non-Custodial</div>
                <div className="text-sm text-muted-foreground">Your Keys, Your Crypto</div>
              </div>
            </div>
            <div
              className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-float crypto-card p-4 rounded-lg text-center sm:text-left"
              style={{ animationDelay: "0.5s" }}
            >
              <Shield className="h-7 w-7 text-primary flex-shrink-0" />
              <div>
                <div className="text-xl font-bold text-foreground">Ethereum</div>
                <div className="text-sm text-muted-foreground">Powered by Smart Contracts</div>
              </div>
            </div>
            <div
              className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-float crypto-card p-4 rounded-lg text-center sm:text-left sm:col-span-2 lg:col-span-1 max-w-sm sm:max-w-none mx-auto" // Centered on mobile
              style={{ animationDelay: "1s" }}
            >
              <Zap className="h-7 w-7 text-secondary flex-shrink-0" />
              <div>
                <div className="text-xl font-bold text-foreground">Instant</div>
                <div className="text-sm text-muted-foreground">On-Chain Swaps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
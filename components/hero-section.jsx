"use client"

import { Button } from "../components/ui/button"
import { ArrowRight, Wallet, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { AppDownload } from "../components/app-download"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-neon"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse-neon"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/4 right-1/4 w-16 h-16 animate-float opacity-20">
          <Image src="/images/bitcoin-coin.jpg" alt="Bitcoin" width={64} height={64} className="rounded-full" />
        </div>
        <div
          className="absolute bottom-1/3 left-1/4 w-12 h-12 animate-float opacity-15"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-xs font-bold">
            ETH
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance glow-text">
            Experience the Power of <span className="gradient-text">Decentralized Finance</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Experience the power of decentralized finance on Ethereum — simple, secure, and transparent. Connect your
            wallet and take control of your crypto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 animate-glow transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              Connect Wallet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 neon-border hover:bg-accent/10 bg-transparent transform hover:scale-105 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          <div className="mb-12">
            <AppDownload />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 animate-float crypto-card p-4 rounded-lg">
              <Wallet className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold text-foreground">Non-Custodial</div>
                <div className="text-sm text-muted-foreground">Your Keys, Your Crypto</div>
              </div>
            </div>
            <div
              className="flex items-center justify-center space-x-3 animate-float crypto-card p-4 rounded-lg"
              style={{ animationDelay: "0.5s" }}
            >
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">Ethereum</div>
                <div className="text-sm text-muted-foreground">Powered by Smart Contracts</div>
              </div>
            </div>
            <div
              className="flex items-center justify-center space-x-3 animate-float crypto-card p-4 rounded-lg"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="h-8 w-8 text-secondary" />
              <div>
                <div className="text-2xl font-bold text-foreground">Instant</div>
                <div className="text-sm text-muted-foreground">On-Chain Swaps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

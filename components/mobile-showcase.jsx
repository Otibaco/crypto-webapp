"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Smartphone, Download, Star } from "lucide-react"

export function MobileShowcase() {
  const [mounted, setMounted] = useState(false)
  const [currentPhone, setCurrentPhone] = useState(0)

  const phoneScreens = [
    {
      image: "/Homepage-Wallet-and-Portfolio.png",
      title: "Advanced Trading",
      description: "Execute trades with professional-grade tools",
    },
    {
      image: "/Homepage-Wallet-and-Portfolio.png",
      title: "Real-time Analytics",
      description: "Monitor your portfolio with live market data",
    },
    {
      image: "/Homepage-Wallet-and-Portfolio.png",
      title: "Global Markets",
      description: "Access worldwide crypto markets 24/7",
    },
  ]

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentPhone((prev) => (prev + 1) % phoneScreens.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-32 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-neon" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse-neon"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-black text-balance glow-text">Trade on the Go</h2>
              <h3 className="text-2xl md:text-3xl font-bold gradient-text">2$weet Mobile App</h3>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Experience the full power of 2$weet in your pocket. Our mobile app delivers professional trading tools,
                real-time market data, and secure wallet management wherever you are.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="crypto-card p-6 rounded-xl">
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-bold mb-2">Intuitive Design</h4>
                <p className="text-muted-foreground">Clean, modern interface designed for both beginners and pros</p>
              </div>
              <div className="crypto-card p-6 rounded-xl">
                <Star className="h-12 w-12 text-accent mb-4" />
                <h4 className="text-xl font-bold mb-2">5-Star Rated</h4>
                <p className="text-muted-foreground">Trusted by millions of users worldwide</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-xl px-8 py-4 animate-glow">
                <Download className="mr-2 h-5 w-5" />
                Download Now
              </Button>
              <Button size="lg" variant="outline" className="text-xl px-8 py-4 neon-border bg-transparent">
                View Features
              </Button>
            </div>
          </div>

          {/* Phone Mockups */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-80 h-[600px]">
              {phoneScreens.map((screen, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentPhone
                      ? "opacity-100 scale-100 rotate-0"
                      : index === (currentPhone + 1) % phoneScreens.length
                        ? "opacity-60 scale-95 rotate-3 translate-x-8"
                        : "opacity-30 scale-90 -rotate-3 -translate-x-8"
                  }`}
                  style={{ zIndex: phoneScreens.length - Math.abs(index - currentPhone) }}
                >
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black">
                      <Image
                        src={screen.image || "/placeholder.svg"}
                        alt={screen.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full animate-float blur-sm" />
            <div
              className="absolute -bottom-10 -left-10 w-16 h-16 bg-accent/20 rounded-full animate-float blur-sm"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

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
    // Adjusted vertical padding
    <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Parallax background elements - adjusted sizing for mobile */}
      <div className="absolute top-10 left-5 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse-neon" />
      <div
        className="absolute bottom-10 right-5 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-neon"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Responsive Grid: Stacks on mobile, side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              {/* Responsive Heading Size */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-balance glow-text">
                Trade on the Go
              </h2>
              {/* Responsive Subtitle Size */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text">2$weet Mobile App</h3>
              {/* Responsive Paragraph Size */}
              <p className="text-base md:text-xl text-muted-foreground text-pretty leading-normal">
                Experience the full power of 2$weet in your pocket. Our mobile app delivers professional trading tools,
                real-time market data, and secure wallet management wherever you are.
              </p>
            </div>

            {/* Feature Cards Grid: Stacks on mobile/tablet, 2-col on small and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="crypto-card p-5 sm:p-6 rounded-xl">
                <Smartphone className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Intuitive Design</h4>
                <p className="text-sm sm:text-base text-muted-foreground">Clean, modern interface designed for both beginners and pros</p>
              </div>
              <div className="crypto-card p-5 sm:p-6 rounded-xl">
                <Star className="h-10 w-10 sm:h-12 sm:w-12 text-accent mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">5-Star Rated</h4>
                <p className="text-sm sm:text-base text-muted-foreground">Trusted by millions of users worldwide</p>
              </div>
            </div>

            {/* Responsive Buttons: Stacks on mobile, inline on small and up */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-xl px-6 sm:px-8 py-3 sm:py-4 animate-glow w-full sm:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Download Now
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-xl px-6 sm:px-8 py-3 sm:py-4 neon-border bg-transparent w-full sm:w-auto">
                View Features
              </Button>
            </div>
          </div>

          {/* Phone Mockups Container */}
          <div className="relative flex justify-center items-center h-full pt-10 lg:pt-0">
            {/* Adjusted Phone Mockup Sizing for all screen sizes (mobile-first) */}
            <div className="relative w-64 h-[480px] lg:w-80 lg:h-[600px]">
              {phoneScreens.map((screen, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentPhone
                      ? "opacity-100 scale-100 rotate-0"
                      : index === (currentPhone + 1) % phoneScreens.length
                        ? "opacity-60 scale-95 rotate-3 translate-x-4 lg:translate-x-8" // Adjusted translate for smaller screens
                        : "opacity-30 scale-90 -rotate-3 -translate-x-4 lg:-translate-x-8" // Adjusted translate for smaller screens
                  }`}
                  style={{ zIndex: phoneScreens.length - Math.abs(index - currentPhone) }}
                >
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] lg:rounded-[3rem] p-2 shadow-2xl">
                    <div className="w-full h-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-black">
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

            {/* Floating elements - adjusted sizing/positioning for mobile to prevent overflow */}
            <div className="absolute -top-5 -right-5 w-16 h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full animate-float blur-sm" />
            <div
              className="absolute -bottom-5 -left-5 w-12 h-12 lg:w-16 lg:h-16 bg-accent/20 rounded-full animate-float blur-sm"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
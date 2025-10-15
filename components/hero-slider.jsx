"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/images/heroslider1.jpg",
    title: "Mine the Future",
    subtitle: "Advanced crypto mining and trading technology",
    description: "Experience the power of next-generation blockchain technology with 2$weet's cutting-edge platform.",
  },
  {
    image: "/images/heroslider2.jpg",
    title: "Knowledge is Power",
    subtitle: "Learn, trade, and grow your crypto portfolio",
    description:
      "Access comprehensive market analysis, educational resources, and expert insights to make informed decisions.",
  },
  {
    image: "/images/heroslider3.jpg",
    title: "Trade Anywhere",
    subtitle: "Professional trading tools at your fingertips",
    description:
      "Execute trades with precision using our advanced platform designed for both beginners and professionals.",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
      </div>

      {/* Parallax overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="transition-all duration-1000 opacity-100 translate-y-0">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-balance glow-text leading-tight">
            {slides[currentSlide].title}
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 gradient-text">{slides[currentSlide].subtitle}</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto text-pretty leading-relaxed">
            {slides[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-6 animate-glow transform hover:scale-105 transition-all duration-300 font-bold"
            >
              Start Trading Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-6 neon-border hover:bg-white/10 bg-transparent text-white border-white/30 transform hover:scale-105 transition-all duration-300 font-bold"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

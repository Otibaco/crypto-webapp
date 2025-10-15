"use client"

import React from "react"

import { useEffect, useRef } from "react"

// ParallaxSectionProps interface removed for JS compatibility

export function ParallaxSection({ children, speed = 0.5, className = "" }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const scrolled = window.pageYOffset
      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + scrolled
      const sectionHeight = rect.height
      const windowHeight = window.innerHeight

      // Only apply parallax when section is in viewport
      if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
        const yPos = -(scrolled - sectionTop) * speed
        section.style.transform = `translateY(${yPos}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}

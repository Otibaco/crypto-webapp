"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"


export function ScrollReveal({ children, direction = "up", delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)"

    switch (direction) {
      case "up":
        return "translate3d(0, 50px, 0)"
      case "down":
        return "translate3d(0, -50px, 0)"
      case "left":
        return "translate3d(50px, 0, 0)"
      case "right":
        return "translate3d(-50px, 0, 0)"
      default:
        return "translate3d(0, 50px, 0)"
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {children}
    </div>
  )
}

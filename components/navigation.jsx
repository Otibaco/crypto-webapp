"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../components/ui/button"
import { Menu, X, Wallet } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CustomAppKitButton from "../components/CustomAppKitButton"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef(null)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/exchange", label: "Exchange" },
    { href: "/mobileApp", label: "Mobile App" },
    { href: "/blog", label: "Blog" },
  ]

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <nav className="fixed top-0 w-full z-50 bg-card text-foreground border-b border-border shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black gradient-text tracking-tight flex items-center">
            <img src="/logo2.png" alt="Logo" className="h-8 w-8 mr-2 inline-block" />
            <span className="text-2xl font-black gradient-text">2$weet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* AppKit Wallet Connect */}
            <div className="relative flex items-center">
              <CustomAppKitButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="absolute top-0 right-0 w-3/4 sm:w-1/2 h-full bg-background text-foreground border-l border-border shadow-2xl p-6 flex flex-col"
            >
              {/* Header Row */}
              <div className="flex justify-between items-center mb-8">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
                  <img src="/logo2.png" alt="Logo" className="h-8 w-8 mr-2 inline-block" />
                  <span className="text-2xl font-black gradient-text">2$weet</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Links + Wallet Button in same scrollable area */}
              <div className="flex flex-col space-y-6 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary font-semibold" : "text-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Wallet Connect aligned with links */}
                <div className="pt-4 border-t border-border">
                  <CustomAppKitButton />

                    
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Download, Twitter, Linkedin, Github, ArrowRight } from "lucide-react"

export function PremiumFooter() {
  return (
    <footer className="bg-gradient-to-br from-background via-card to-background border-t border-border">
      {/* App Download CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black glow-text">Start Trading Today</h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Join millions of users who trust 2$weet for their crypto trading needs. Download our app and start your
                journey to financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 animate-glow">
                  <Download className="mr-2 h-5 w-5" />
                  Download for iOS
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 neon-border bg-transparent">
                  <Download className="mr-2 h-5 w-5" />
                  Download for Android
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/images/mobile-trading.jpg"
                  alt="2$weet Mobile App"
                  width={300}
                  height={600}
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full animate-pulse-neon blur-sm" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full animate-pulse-neon blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="text-4xl font-black gradient-text tracking-tight">
                2$weet
              </Link>
              <p className="text-muted-foreground text-pretty">
                The future of crypto trading. Secure, fast, and intuitive platform trusted by millions worldwide.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Products</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/buy-sell" className="text-muted-foreground hover:text-primary transition-colors">
                    Spot Trading
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                    Advanced Tools
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                    Mobile App
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                    API Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="text-muted-foreground hover:text-primary transition-colors">
                    Investors
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest crypto news and updates.</p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="bg-background border-border" />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground">© 2024 2$weet. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Twitter, Github, MessageCircle, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black mb-4 gradient-text">2$weet</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your gateway to decentralized finance on Ethereum. Non-custodial, transparent, and built for everyone.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://twitter.com/Emmanuelon42861"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/emmanuel-onyekachi-2593342a8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </Link>
              <Link
                href="https://discord.com/invite/2sswpseurt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/exchange" className="text-muted-foreground hover:text-primary transition-colors">
                  Token Exchange
                </Link>
              </li>
              <li>
                <Link href="/mobileApp" className="text-muted-foreground hover:text-primary transition-colors">
                  Mobile App
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Wallet Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© 2025 2$weet. Built on Ethereum. Your keys, your crypto.</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Smart Contract
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Audit Report
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

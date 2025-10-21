import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const highlights = [
  {
    title: "Understanding WalletConnect in Simple Terms",
    excerpt: "Learn how WalletConnect enables secure connections between your wallet and dApps.",
    category: "Web3 Basics",
    date: "Jan 15, 2025",
    image: "/Understanding-WalletConnect-Simple-Terms.jpeg",
  },
  {
    title: "How to Stay Safe in Web3",
    excerpt: "Essential security practices for protecting your crypto wallet and assets.",
    category: "Security",
    date: "Jan 12, 2025",
    image: "/web3-security.jpeg",
  },
  {
    title: "The Rise of Ethereum DeFi",
    excerpt: "Exploring how Ethereum became the foundation of decentralized finance.",
    category: "DeFi Trends",
    date: "Jan 10, 20257",
    image: "/The-Rise-of-Ethereum-DeFi.jpg",
  },
]

export function BlogHighlights() {
  return (
    // Adjusted vertical padding
    <section className="py-20 lg:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          {/* Responsive Heading Size */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 glow-text text-balance">
            Latest from Our <span className="gradient-text">Blog</span>
          </h2>
          {/* Responsive Paragraph Size and Width */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Stay informed with educational content about DeFi, Web3 security, and Ethereum
          </p>
        </div>

        {/* Responsive Grid Layout: Stacks on mobile, 3-col on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-10 lg:mb-12">
          {highlights.map((post, index) => (
            <Card
              key={index}
              className="crypto-card overflow-hidden hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
            >
              {/* Image height adjusted for mobile */}
              <div className="relative h-40 sm:h-48">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                {/* Title text size adjusted for mobile */}
                <CardTitle className="text-lg sm:text-xl leading-snug font-bold text-balance">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {/* Excerpt text size adjusted for mobile */}
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-normal text-pretty">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm">
                    Read
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline" className="neon-border bg-transparent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
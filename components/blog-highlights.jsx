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
    image: "/images/bitcoin-phone.jpg",
  },
  {
    title: "How to Stay Safe in Web3",
    excerpt: "Essential security practices for protecting your crypto wallet and assets.",
    category: "Security",
    date: "Jan 12, 2025",
    image: "/images/heroslider1.jpg",
  },
  {
    title: "The Rise of Ethereum DeFi",
    excerpt: "Exploring how Ethereum became the foundation of decentralized finance.",
    category: "DeFi Trends",
    date: "Jan 10, 2025",
    image: "/images/pc-trading.jpg",
  },
]

export function BlogHighlights() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">
            Latest from Our <span className="gradient-text">Blog</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Stay informed with educational content about DeFi, Web3 security, and Ethereum
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {highlights.map((post, index) => (
            <Card
              key={index}
              className="crypto-card overflow-hidden hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
            >
              <div className="relative h-48">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-xl leading-tight font-bold">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
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
            <Button size="lg" variant="outline" className="neon-border bg-transparent text-lg px-8 py-4">
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function BlogPage() {
  const featuredPost = {
    title: "Understanding WalletConnect in Simple Terms",
    excerpt:
      "Learn how WalletConnect enables secure connections between your wallet and dApps. A beginner-friendly guide to Web3's most important protocol.",
    author: "Sarah Chen",
    date: "January 15, 2025",
    readTime: "8 min read",
    category: "Web3 Basics",
    image: "/understanding-web3.jpg",
  }

  const blogPosts = [
    {
      title: "How to Stay Safe in Web3",
      excerpt:
        "Essential security practices for protecting your crypto wallet and assets in the decentralized world.",
      author: "Marcus Rodriguez",
      date: "January 12, 2025",
      readTime: "5 min read",
      category: "Security",
      image: "/security-asset.jpg",
    },
    {
      title: "The Rise of Ethereum DeFi",
      excerpt:
        "Exploring how Ethereum became the foundation of decentralized finance and what makes it special.",
      author: "Emily Watson",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "DeFi Trends",
      image: "/ti-coin.jpg",
    },
    {
      title: "Smart Contracts Explained for Beginners",
      excerpt:
        "What are smart contracts and how do they power decentralized applications on Ethereum?",
      author: "David Kim",
      date: "January 8, 2025",
      readTime: "4 min read",
      category: "Education",
      image: "/markus.jpg",
    },
    {
      title: "MetaMask vs Trust Wallet: Which is Right for You?",
      excerpt:
        "Comparing the two most popular Ethereum wallets to help you choose the best option for your needs.",
      author: "Lisa Thompson",
      date: "January 5, 2025",
      readTime: "7 min read",
      category: "Wallet Guides",
      image: "/Metamask-vs-Trust.png",
    },
    {
      title: "Gas Fees Demystified: A Complete Guide",
      excerpt:
        "Understanding Ethereum gas fees, how they work, and strategies to minimize transaction costs.",
      author: "Alex Johnson",
      date: "January 3, 2025",
      readTime: "5 min read",
      category: "Education",
      image: "/gas-fee.jpg",
    },
    {
      title: "The Future of Non-Custodial Finance",
      excerpt:
        "Why self-custody is the future and how non-custodial platforms are changing the financial landscape.",
      author: "Rachel Park",
      date: "December 30, 2024",
      readTime: "6 min read",
      category: "DeFi Trends",
      image: "/Custodial-Finance.jpeg",
    },
  ]

  const categories = [
    "All",
    "Web3 Basics",
    "DeFi Trends",
    "Security",
    "Wallet Guides",
    "Education",
    "Blockchain",
  ]

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* HERO SECTION */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 glow-text break-words">
            2$weet <span className="gradient-text">Blog / News</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Educational and trust-building hub for DeFi users. Learn about Web3 safety, Ethereum trends, and
            beginner-friendly guides to decentralized finance.
          </p>
        </div>

        {/* FEATURED POST */}
        <div className="max-w-6xl mx-auto mt-12">
          <Card className="crypto-card overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-full">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                  <Badge className="bg-primary text-primary-foreground text-sm sm:text-base px-3 sm:px-4 py-1.5">
                    Featured
                  </Badge>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <Badge variant="outline" className="neon-border w-fit mb-4 sm:mb-6 text-sm sm:text-base px-3 sm:px-4 py-1.5">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 glow-text leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap gap-4 text-sm sm:text-base text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-fit text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={category === "All" ? "default" : "outline"}
                className={`${category === "All"
                    ? "bg-primary hover:bg-primary/90 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                    : "neon-border text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG POSTS GRID */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="crypto-card overflow-hidden hover:scale-[1.02] transition-transform duration-300 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
              >
                <div className="relative h-56 sm:h-64">
                  <Image src={post.image} alt={post.title} fill className="object-contain" />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl font-bold leading-snug">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-6">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs sm:text-sm">
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Button
              size="lg"
              variant="outline"
              className="neon-border bg-transparent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp className="hidden w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 mx-auto mb-6 sm:mb-8 text-primary" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 glow-text">
            Stay Updated
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed">
            Subscribe to our newsletter for the latest DeFi insights and Web3 education.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              data-has-listeners="true"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

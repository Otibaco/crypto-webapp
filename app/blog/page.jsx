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
    image: "/images/bitcoin-phone.jpg",
  }

  const blogPosts = [
    {
      title: "How to Stay Safe in Web3",
      excerpt: "Essential security practices for protecting your crypto wallet and assets in the decentralized world.",
      author: "Marcus Rodriguez",
      date: "January 12, 2025",
      readTime: "5 min read",
      category: "Security",
      image: "/images/heroslider1.jpg",
    },
    {
      title: "The Rise of Ethereum DeFi",
      excerpt: "Exploring how Ethereum became the foundation of decentralized finance and what makes it special.",
      author: "Emily Watson",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "DeFi Trends",
      image: "/images/pc-trading.jpg",
    },
    {
      title: "Smart Contracts Explained for Beginners",
      excerpt: "What are smart contracts and how do they power decentralized applications on Ethereum?",
      author: "David Kim",
      date: "January 8, 2025",
      readTime: "4 min read",
      category: "Education",
      image: "/images/mobile-trading.jpg",
    },
    {
      title: "MetaMask vs Trust Wallet: Which is Right for You?",
      excerpt: "Comparing the two most popular Ethereum wallets to help you choose the best option for your needs.",
      author: "Lisa Thompson",
      date: "January 5, 2025",
      readTime: "7 min read",
      category: "Wallet Guides",
      image: "/images/hands-on-desk2.jpg",
    },
    {
      title: "Gas Fees Demystified: A Complete Guide",
      excerpt: "Understanding Ethereum gas fees, how they work, and strategies to minimize transaction costs.",
      author: "Alex Johnson",
      date: "January 3, 2025",
      readTime: "5 min read",
      category: "Education",
      image: "/images/investor-on-phone.jpg",
    },
    {
      title: "The Future of Non-Custodial Finance",
      excerpt: "Why self-custody is the future and how non-custodial platforms are changing the financial landscape.",
      author: "Rachel Park",
      date: "December 30, 2024",
      readTime: "6 min read",
      category: "DeFi Trends",
      image: "/images/heroslider3.jpg",
    },
  ]

  const categories = ["All", "Web3 Basics", "DeFi Trends", "Security", "Wallet Guides", "Education", "Blockchain"]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 glow-text">
              2$weet <span className="gradient-text">Blog/News</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              Educational and trust-building hub for DeFi users. Learn about Web3 safety, Ethereum trends, and
              beginner-friendly guides to decentralized finance.
            </p>
          </div>

          {/* Featured Post */}
          <Card className="crypto-card overflow-hidden mb-16 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-80 lg:h-auto">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">Featured</Badge>
                </div>
              </div>
              <div className="p-10 flex flex-col justify-center">
                <Badge variant="outline" className="neon-border w-fit mb-6 text-lg px-4 py-2">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black mb-6 glow-text">{featuredPost.title}</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 mb-8 text-lg text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-fit text-lg px-8 py-4">
                  Read Article
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                size="lg"
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
                    ? "bg-primary hover:bg-primary/90 text-lg px-6 py-3"
                    : "neon-border text-lg px-6 py-3"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="crypto-card overflow-hidden hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
              >
                <div className="relative h-64">
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
                  <p className="text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" variant="outline" className="neon-border bg-transparent text-lg px-8 py-4">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-32 px-4 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <TrendingUp className="w-20 h-20 mx-auto mb-8 text-primary" />
          <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">Stay Updated</h2>
          <p className="text-2xl text-muted-foreground mb-12 text-pretty">
            Subscribe to our newsletter for the latest DeFi insights and Web3 education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 text-lg rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
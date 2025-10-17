import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import CustomAppKitButton from "../../components/CustomAppKitButton"

import { Shield, Users, Globe, Lock, Zap, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      {/* Adjusted padding for mobile/desktop consistency */}
      <section className="pt-24 pb-12 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            {/* Responsive Heading Size */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 glow-text text-balance">
              About <span className="gradient-text">2$weet</span>
            </h1>
            {/* Responsive Paragraph Size and Width */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-normal text-pretty">
              We're building a future where everyone can access decentralized finance securely on Ethereum — no banks,
              no intermediaries, just you and your wallet.
            </p>
          </div>

          {/* Responsive Grid: Stacks on mobile, side-by-side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8">
              {/* Responsive Sub-Heading Size */}
              <h2 className="text-3xl md:text-4xl font-black glow-text">Our Mission</h2>
              {/* Responsive Text Size */}
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-pretty">
                At 2$weet, we believe in the power of decentralization. Our mission is to make Ethereum-based DeFi
                accessible to everyone, regardless of technical expertise or financial background.
              </p>
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-pretty">
                Built on Ethereum, fully non-custodial, and prioritizing user control and privacy, we promote open
                innovation and community-driven growth. Your keys, your crypto, your future.
              </p>
              <CustomAppKitButton />
            </div>
            {/* Image Section */}
            <div className="relative mt-8 lg:mt-0">
              <Image
                src="/defi.jpeg"
                alt="Collaborative DeFi environment"
                width={600}
                height={400}
                // Ensure image fits container without overflow
                className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
              {/* Background elements sized down for mobile, positioned relative to their parent div */}
              <div className="absolute -top-3 -right-3 w-16 h-16 sm:w-24 sm:h-24 bg-primary/20 rounded-full animate-pulse-neon blur-sm" />
              <div className="absolute -bottom-3 -left-3 w-10 h-10 sm:w-16 sm:h-16 bg-accent/20 rounded-full animate-pulse-neon blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      {/* Adjusted padding for mobile */}
      <section className="py-20 lg:py-32 px-4 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            {/* Responsive Heading Size */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 glow-text text-balance">Our Core Values</h2>
            {/* Responsive Paragraph Size */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              These principles guide our commitment to building a truly decentralized future
            </p>
          </div>

          {/* Responsive Grid: 1-col on mobile, 2-col on tablet, 3-col on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {[
              { icon: Lock, iconT:"/server.png", title: "Non-Custodial", description: "You maintain full control of your funds. We never hold or have access to your private keys.", color: "text-primary" },
              { icon: Shield, iconT:"/server.png", title: "Built on Ethereum", description: "Powered by audited smart contracts on the world's most secure blockchain", color: "text-secondary" },
              { icon: Globe, iconT:"/display.png", title: "Transparent", description: "All transactions are on-chain and verifiable. No hidden fees or intermediaries.", color: "text-accent" },
              { icon: Users, iconT:"/grassroots.png", title: "Community-Driven", description: "Built by the community, for the community. Open innovation and collaboration.", color: "text-purple-400" }, // Assuming text-chart-4 maps to a color
              { icon: Zap, iconT:"/instant.png", title: "Instant", description: "Lightning-fast token swaps with on-chain confirmation in seconds", color: "text-primary" },
              { icon: Heart, iconT:"/protection.png", title: "User Privacy", description: "No KYC, no data collection. Your privacy is your right.", color: "text-accent" },
            ].map((value, index) => (
              <Card key={index} className="crypto-card text-center p-6 sm:p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                <CardContent className="pt-6 sm:pt-8">
                  <value.icon className={`hidden w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 ${value.color}`} />
                  <Image src={value.iconT} alt={value.title} width={40} height={40} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 size-16" />
                  {/* Responsive Card Title Size */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{value.title}</h3>
                  {/* Responsive Card Description Size */}
                  <p className="text-base sm:text-lg text-muted-foreground leading-normal text-pretty">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why DeFi Section */}
      {/* Adjusted padding for mobile */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            {/* Responsive Heading Size */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 glow-text text-balance">
              Why <span className="gradient-text">Decentralized Finance</span>?
            </h2>
            {/* Responsive Paragraph Size */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              DeFi represents the future of finance - open, transparent, and accessible to everyone
            </p>
          </div>

          {/* Comparison Cards: Stacks on mobile, 2-col on tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <Card className="crypto-card p-6 sm:p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 gradient-text">Traditional Finance</h3>
              <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                  <span>Banks control your funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                  <span>Limited access hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                  <span>High fees and hidden costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                  <span>Requires extensive documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                  <span>Centralized control and censorship</span>
                </li>
              </ul>
            </Card>

            <Card className="crypto-card p-6 sm:p-10 border-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 gradient-text">Decentralized Finance</h3>
              <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>You control your funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>24/7 global access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Transparent, minimal fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>No KYC or paperwork needed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                  <span>Permissionless and censorship-resistant</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
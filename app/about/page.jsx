import { Navigation } from "../../components/navigation"
import  Footer from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Shield, Users, Globe, Lock, Zap, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 glow-text">
              About <span className="gradient-text">2$weet</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              We're building a future where everyone can access decentralized finance securely on Ethereum — no banks,
              no intermediaries, just you and your wallet.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black glow-text">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
                At 2$weet, we believe in the power of decentralization. Our mission is to make Ethereum-based DeFi
                accessible to everyone, regardless of technical expertise or financial background.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
                Built on Ethereum, fully non-custodial, and prioritizing user control and privacy, we promote open
                innovation and community-driven growth. Your keys, your crypto, your future.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 animate-glow text-xl px-8 py-4">
                Connect Your Wallet
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/hands-on-desk2.jpg"
                alt="Collaborative DeFi environment"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full animate-pulse-neon blur-sm" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full animate-pulse-neon blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">Our Core Values</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              These principles guide our commitment to building a truly decentralized future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Lock className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Non-Custodial</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  You maintain full control of your funds. We never hold or have access to your private keys.
                </p>
              </CardContent>
            </Card>

            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Shield className="w-16 h-16 mx-auto mb-6 text-secondary" />
                <h3 className="text-2xl font-bold mb-4">Built on Ethereum</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Powered by audited smart contracts on the world's most secure blockchain
                </p>
              </CardContent>
            </Card>

            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Globe className="w-16 h-16 mx-auto mb-6 text-accent" />
                <h3 className="text-2xl font-bold mb-4">Transparent</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  All transactions are on-chain and verifiable. No hidden fees or intermediaries.
                </p>
              </CardContent>
            </Card>

            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Users className="w-16 h-16 mx-auto mb-6 text-chart-4" />
                <h3 className="text-2xl font-bold mb-4">Community-Driven</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Built by the community, for the community. Open innovation and collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Zap className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Instant</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Lightning-fast token swaps with on-chain confirmation in seconds
                </p>
              </CardContent>
            </Card>

            <Card className="crypto-card text-center p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <CardContent className="pt-8">
                <Heart className="w-16 h-16 mx-auto mb-6 text-accent" />
                <h3 className="text-2xl font-bold mb-4">User Privacy</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No KYC, no data collection. Your privacy is your right.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why DeFi Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">
              Why <span className="gradient-text">Decentralized Finance</span>?
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              DeFi represents the future of finance - open, transparent, and accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="crypto-card p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Traditional Finance</h3>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Banks control your funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Limited access hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✗</span>
                  <span>High fees and hidden costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Requires extensive documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-1">✗</span>
                  <span>Centralized control and censorship</span>
                </li>
              </ul>
            </Card>

            <Card className="crypto-card p-10 border-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Decentralized Finance</h3>
              <ul className="space-y-4 text-lg text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>You control your funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>24/7 global access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Transparent, minimal fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>No KYC or paperwork needed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
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

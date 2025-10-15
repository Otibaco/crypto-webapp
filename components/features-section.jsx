import { Card, CardContent } from "../components/ui/card"
import { Wallet, Shield, Globe, Zap, Smartphone, Lock } from "lucide-react"

const features = [
  {
    icon: Wallet,
    title: "One-Click Wallet Connection",
    description: "Connect with MetaMask, Trust Wallet, WalletConnect, and more. Access your Ethereum assets instantly.",
  },
  {
    icon: Shield,
    title: "Non-Custodial Security",
    description: "You keep full control of your funds. Your keys, your crypto. We never hold or access your assets.",
  },
  {
    icon: Globe,
    title: "Decentralized & Transparent",
    description: "All transactions are on-chain and verifiable. No intermediaries, no hidden fees, just pure DeFi.",
  },
  {
    icon: Zap,
    title: "Instant Token Swaps",
    description: "Swap ERC-20 tokens instantly with on-chain confirmation powered by Ethereum smart contracts.",
  },
  {
    icon: Smartphone,
    title: "Cross-Device Access",
    description: "Access your wallet from mobile or desktop. Sync seamlessly between devices with WalletConnect.",
  },
  {
    icon: Lock,
    title: "Smart Contract Powered",
    description: "Built on Ethereum blockchain with audited smart contracts for maximum security and transparency.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 glow-text">
            Why Choose <span className="gradient-text">2$weet</span>?
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
            Built on Ethereum. Fully non-custodial. Prioritizing user control and privacy. Experience true decentralized
            finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="crypto-card hover:scale-105 transition-all duration-300 group border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

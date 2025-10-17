import Image from "next/image"
import { Card, CardContent } from "../components/ui/card"
import { Wallet, Shield, Globe, Zap, Smartphone, Lock } from "lucide-react"

const features = [
  {
    icon: Wallet,
    iconT: "/blockchain.png",
    title: "One-Click Wallet Connection",
    description: "Connect with MetaMask, Trust Wallet, WalletConnect, and more. Access your Ethereum assets instantly.",
  },
  {
    icon: Shield,
    iconT: "/server.png",
    title: "Non-Custodial Security",
    description: "You keep full control of your funds. Your keys, your crypto. We never hold or access your assets.",
  },
  {
    icon: Globe,
    iconT: "/tap.png",
    title: "Decentralized & Transparent",
    description: "All transactions are on-chain and verifiable. No intermediaries, no hidden fees, just pure DeFi.",
  },
  {
    icon: Zap,
    iconT: "/instant.png",
    title: "Instant Token Swaps",
    description: "Swap ERC-20 tokens instantly with on-chain confirmation powered by Ethereum smart contracts.",
  },
  {
    icon: Smartphone,
    iconT: "/router-device.png",
    title: "Cross-Device Access",
    description: "Access your wallet from mobile or desktop. Sync seamlessly between devices with WalletConnect.",
  },
  {
    icon: Lock,
    iconT: "/smart-contract.png",
    title: "Smart Contract Powered",
    description: "Built on Ethereum blockchain with audited smart contracts for maximum security and transparency.",
  },
]

export function FeaturesSection() {
  return (
    // Adjusted vertical padding for better mobile spacing
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-20">
          {/* Responsive Heading Size */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 glow-text text-balance">
            Why Choose <span className="gradient-text">2$weet</span>?
          </h2>
          {/* Responsive Paragraph Size and Width */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-normal">
            Built on Ethereum. Fully non-custodial. Prioritizing user control and privacy. Experience true decentralized
            finance.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="crypto-card hover:scale-[1.02] transition-all duration-300 group border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
            >
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start space-x-4 mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <feature.icon className="hidden h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <Image src={feature.iconT} alt={feature.title} width={40} height={40} className="size-16" />
                  </div>
                  {/* Smaller Title on Mobile */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">{feature.title}</h3>
                </div>
                {/* Smaller Paragraph on Mobile */}
                <p className="text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed pl-10 sm:pl-12">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
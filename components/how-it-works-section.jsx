import { Card, CardContent } from "../components/ui/card"
import { Wallet, Eye, ArrowDownUp, Shield } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    icon: "/wallet.png",
    iconT: Wallet,
    title: "Connect Your Wallet",
    description: "Connect with MetaMask, Trust Wallet, or any WalletConnect-supported wallet in one click.",
    step: "01",
  },
  {
    icon: "/monitoring-system.png",
    iconT: Eye,
    title: "View Your Assets",
    description: "See your real-time Ethereum token balances and portfolio value instantly.",
    step: "02",
  },
  {
    icon: "/exchange.png",
    iconT: ArrowDownUp,
    title: "Swap Tokens",
    description: "Exchange ERC-20 tokens instantly with transparent on-chain confirmation.",
    step: "03",
  },
  {
    icon: "/remote-control.png",
    iconT: Shield,
    title: "Stay in Control",
    description: "Your funds never leave your wallet. You maintain full custody and control at all times.",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    // Adjusted vertical padding
    <section className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          {/* Responsive Heading Size */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            How It <span className="gradient-text">Works</span>
          </h2>
          {/* Responsive Paragraph Size */}
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Get started with DeFi on Ethereum in just 4 simple steps
          </p>
        </div>
  
        {/* Responsive Grid Layout: Stacks on mobile, 2-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="crypto-card hover:scale-[1.02] transition-all duration-300 h-full">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <step.iconT className="hidden h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      <Image src={step.icon} alt={step.title} width={40} height={40} className="size-16" />
                    </div>
                    {/* Step number badge size adjusted */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  {/* Smaller Title/Description on Mobile */}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-pretty">{step.description}</p>
                </CardContent>
              </Card>

              {/* Connector line visible only on desktop (lg) and between cards */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
import { Card, CardContent } from "../components/ui/card"
import { Wallet, Eye, ArrowDownUp, Shield } from "lucide-react"

const steps = [
  {
    icon: Wallet,
    title: "Connect Your Wallet",
    description: "Connect with MetaMask, Trust Wallet, or any WalletConnect-supported wallet in one click.",
    step: "01",
  },
  {
    icon: Eye,
    title: "View Your Assets",
    description: "See your real-time Ethereum token balances and portfolio value instantly.",
    step: "02",
  },
  {
    icon: ArrowDownUp,
    title: "Swap Tokens",
    description: "Exchange ERC-20 tokens instantly with transparent on-chain confirmation.",
    step: "03",
  },
  {
    icon: Shield,
    title: "Stay in Control",
    description: "Your funds never leave your wallet. You maintain full custody and control at all times.",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with DeFi on Ethereum in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="crypto-card hover:scale-105 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty">{step.description}</p>
                </CardContent>
              </Card>

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

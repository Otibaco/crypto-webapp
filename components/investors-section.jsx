"use client"

import { Card, CardContent } from "../components/ui/card"
import Image from "next/image"
import { TrendingUp, Users, DollarSign, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10M+",
    label: "Active Users",
    description: "Trusted by millions worldwide",
  },
  {
    icon: DollarSign,
    value: "$50B+",
    label: "Trading Volume",
    description: "Monthly trading volume",
  },
  {
    icon: TrendingUp,
    value: "500+",
    label: "Cryptocurrencies",
    description: "Available for trading",
  },
  {
    icon: Award,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable platform performance",
  },
]

export function InvestorsSection() {
  return (
    <section className="py-32 bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-neon" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse-neon"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 glow-text">
            Trusted by <span className="gradient-text">Investors</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
            Join the world's leading crypto exchange platform backed by top-tier investors and trusted by millions of
            traders globally.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="crypto-card text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-black mb-2 gradient-text">{stat.value}</div>
                <div className="text-xl font-bold mb-2">{stat.label}</div>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investor Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold">Professional Trading Environment</h3>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Our platform provides institutional-grade tools and analytics that professional traders and investors rely
              on for making informed decisions in the crypto market.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="crypto-card p-6 rounded-xl">
                <h4 className="text-lg font-bold mb-2">Institutional Grade</h4>
                <p className="text-muted-foreground">Professional tools for serious traders</p>
              </div>
              <div className="crypto-card p-6 rounded-xl">
                <h4 className="text-lg font-bold mb-2">Real-time Data</h4>
                <p className="text-muted-foreground">Live market feeds and analytics</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hands-on-desk2.jpg"
                  alt="Professional trading meeting"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/pc-trading.jpg"
                  alt="Trading platform on desktop"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </div>
            </div>
            <div className="space-y-6 mt-8 sm:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/investor-on-phone.jpg"
                  alt="Mobile trading app"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/bitcoin-phone.jpg"
                  alt="Bitcoin trading interface"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

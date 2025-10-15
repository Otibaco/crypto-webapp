"use client"

import { Card, CardContent } from "../components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 67420.5, change: 2.34, logo: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 3245.8, change: -1.23, logo: "Ξ" },
  { symbol: "USDT", name: "Tether", price: 1.0, change: 0.01, logo: "₮" },
  { symbol: "BNB", name: "BNB", price: 598.45, change: 3.67, logo: "BNB" },
  { symbol: "SOL", name: "Solana", price: 178.92, change: 5.43, logo: "◎" },
  { symbol: "ADA", name: "Cardano", price: 0.4567, change: -2.11, logo: "₳" },
  { symbol: "AVAX", name: "Avalanche", price: 34.78, change: 1.89, logo: "AVAX" },
  { symbol: "DOT", name: "Polkadot", price: 6.23, change: -0.45, logo: "●" },
]

export function CryptoPricesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(cryptoData.length / 4))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const visibleCryptos = cryptoData.slice(currentIndex * 4, (currentIndex + 1) * 4)

  return (
    <section id="prices" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="gradient-text">Market Prices</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time cryptocurrency prices updated every second
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visibleCryptos.map((crypto, index) => (
            <Card
              key={crypto.symbol}
              className="crypto-card hover:scale-105 transition-all duration-300 animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {crypto.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{crypto.symbol}</div>
                      <div className="text-sm text-muted-foreground">{crypto.name}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">${crypto.price.toLocaleString()}</div>
                  <div
                    className={`flex items-center space-x-1 ${crypto.change >= 0 ? "text-accent" : "text-destructive"}`}
                  >
                    {crypto.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">
                      {crypto.change >= 0 ? "+" : ""}
                      {crypto.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(cryptoData.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

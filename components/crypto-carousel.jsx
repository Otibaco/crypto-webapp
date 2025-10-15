"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"

const cryptoData = [
  // EVM Native / Ecosystem Tokens
  { symbol: "ETH", name: "Ethereum", price: "$3,456.78", change: "+1.23%", positive: true },      // Ethereum Mainnet (Gas)
  { symbol: "BNB", name: "BNB", price: "$589.12", change: "-0.87%", positive: false },           // BNB Chain (Gas)
  { symbol: "MATIC", name: "Polygon", price: "$0.75", change: "+0.55%", positive: true },         // Polygon (Native token)
  { symbol: "AVAX", name: "Avalanche", price: "$34.67", change: "-1.23%", positive: false },     // Avalanche C-Chain (Gas)
  { symbol: "FTM", name: "Fantom", price: "$0.32", change: "+1.90%", positive: true },           // Fantom (Gas)
  { symbol: "ARB", name: "Arbitrum", price: "$1.15", change: "+3.10%", positive: true },         // Arbitrum (Ecosystem/Governance)
  { symbol: "OP", name: "Optimism", price: "$2.50", change: "-0.40%", positive: false },          // Optimism (Ecosystem/Governance)
  { symbol: "GNO", name: "Gnosis", price: "$280.00", change: "+0.70%", positive: true },          // Gnosis Chain (Example of 8th EVM chain)

  // Stablecoins (ERC-20 tokens on Ethereum EVM)
  { symbol: "USDT", name: "Tether (ERC-20)", price: "$1.00", change: "+0.01%", positive: true }, // Tether
  { symbol: "USDC", name: "USD Coin (ERC-20)", price: "$1.00", change: "-0.01%", positive: false }, // USDC
];

export function CryptoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cryptoData.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cryptoData.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cryptoData.length) % cryptoData.length)
    setIsAutoPlaying(false)
  }

  const visibleCryptos = [
    cryptoData[currentIndex],
    cryptoData[(currentIndex + 1) % cryptoData.length],
    cryptoData[(currentIndex + 2) % cryptoData.length],
    cryptoData[(currentIndex + 3) % cryptoData.length],
  ]

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold gradient-text">Live Crypto Prices</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="neon-border hover:bg-primary/10 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="neon-border hover:bg-primary/10 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCryptos.map((crypto, index) => (
          <div
            key={`${crypto.symbol}-${currentIndex}-${index}`}
            className="crypto-card p-4 rounded-lg transition-all duration-300 hover:scale-105 animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xs font-bold">
                  {crypto.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{crypto.symbol}</p>
                  <p className="text-xs text-muted-foreground">{crypto.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold">{crypto.price}</p>
              <p className={`text-sm ${crypto.positive ? "text-accent" : "text-destructive"}`}>{crypto.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {cryptoData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

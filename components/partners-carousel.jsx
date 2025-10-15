"use client"

import { useEffect, useState } from "react"

const partners = [
  { name: "Coinbase", logo: "CB" },
  { name: "Binance", logo: "BN" },
  { name: "Kraken", logo: "KR" },
  { name: "Gemini", logo: "GM" },
  { name: "Bitfinex", logo: "BF" },
  { name: "Huobi", logo: "HB" },
  { name: "KuCoin", logo: "KC" },
  { name: "OKX", logo: "OK" },
  { name: "Bybit", logo: "BB" },
  { name: "Gate.io", logo: "GT" },
]

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-2xl font-bold gradient-text text-center mb-8">Trusted by Leading Exchanges</h3>

      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(currentIndex * 100) / 5}%)` }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <div key={`${partner.name}-${index}`} className="flex-shrink-0 w-1/5 px-4">
              <div className="crypto-card p-6 rounded-lg text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xl font-bold">
                  {partner.logo}
                </div>
                <p className="text-sm font-medium">{partner.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

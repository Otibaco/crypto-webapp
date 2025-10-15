"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"


export function MarketTicker() {
  const [prices] = useState([
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

  ])

  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border py-3 overflow-hidden">
      <div className="flex animate-scroll">
        {[...prices, ...prices].map((crypto, index) => (
          <div key={index} className="flex items-center gap-3 px-6 whitespace-nowrap">
            <span className="font-bold text-foreground">{crypto.symbol}</span>
            <span className="text-muted-foreground">{crypto.price}</span>
            <span
              className={`flex items-center gap-1 text-sm ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {crypto.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(crypto.change)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

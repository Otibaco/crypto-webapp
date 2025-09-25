"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"

const assets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: "0.00234",
    value: 98420.5,
    change: "+2.4%",
    logo: "₿",
    color: "text-orange-400",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "1.2456",
    value: 3890.75,
    change: "+1.8%",
    logo: "Ξ",
    color: "text-blue-400",
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: "12.45",
    value: 245.3,
    change: "+5.2%",
    logo: "◎",
    color: "text-purple-400",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,250.00",
    value: 1.0,
    change: "0.0%",
    logo: "$",
    color: "text-green-400",
  },
]

export function DashboardPage() {
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    // Calculate total balance
    const total = assets.reduce((sum, asset) => {
      return sum + Number.parseFloat(asset.balance.replace(",", "")) * asset.value
    }, 0)
    setTotalBalance(total)
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Manage your crypto portfolio</p>
        </div>
        <div className="w-10 h-10 rounded-full gradient-purple-blue flex items-center justify-center">
          <span className="text-white font-bold">CW</span>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="p-6 gradient-purple-blue glow-purple">
        <div className="text-center space-y-2">
          <p className="text-white/80 text-sm">Total Balance</p>
          <h2 className="text-3xl font-bold text-white animate-count-up">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className="text-white/80 text-sm">+$1,234.56 (+2.1%) today</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-3 md:grid-cols-4 md:gap-4 lg:max-w-md lg:mx-auto">
        <Link href="/send">
          <Button className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
            <ArrowUp className="h-5 w-5 text-primary md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Send</span>
          </Button>
        </Link>

        <Link href="/receive">
          <Button className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
            <ArrowDown className="h-5 w-5 text-accent md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Receive</span>
          </Button>
        </Link>

        <Link href="/swap">
          <Button className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
            <ArrowUpDown className="h-5 w-5 text-chart-3 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Swap</span>
          </Button>
        </Link>

        <Link href="/buy">
          <Button className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
            <ShoppingCart className="h-5 w-5 text-chart-4 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Buy</span>
          </Button>
        </Link>
      </div>

      {/* Your Assets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Assets</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>

        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:space-y-3">
          {assets.map((asset, index) => (
            <Card
              key={asset.symbol}
              className="p-4 hover:bg-secondary/50 transition-colors duration-200 animate-in slide-in-from-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center glow-purple ${asset.color}`}
                  >
                    <span className="text-lg font-bold">{asset.logo}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold animate-count-up">
                    {asset.balance} {asset.symbol}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground">
                      ${(Number.parseFloat(asset.balance.replace(",", "")) * asset.value).toLocaleString()}
                    </p>
                    <span className={`text-xs ${asset.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                      {asset.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History Shortcut */}
      <Link href="/history">
        <Card className="p-4 hover:bg-secondary/50 transition-colors duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Transaction History</p>
                <p className="text-sm text-muted-foreground">View all transactions</p>
              </div>
            </div>
            <ArrowUp className="h-4 w-4 text-muted-foreground rotate-45" />
          </div>
        </Card>
      </Link>
    </div>
  )
}

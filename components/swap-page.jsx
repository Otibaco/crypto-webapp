"use client"

import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, ArrowUpDown, Settings, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "../lib/utils"

const assets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.00234", price: 98420.5, logo: "₿", color: "text-orange-400" },
  { symbol: "ETH", name: "Ethereum", balance: "1.2456", price: 3890.75, logo: "Ξ", color: "text-blue-400" },
  { symbol: "SOL", name: "Solana", balance: "12.45", price: 245.3, logo: "◎", color: "text-purple-400" },
  { symbol: "USDC", name: "USD Coin", balance: "1,250.00", price: 1.0, logo: "$", color: "text-green-400" },
]

export function SwapPage() {
  const [fromAsset, setFromAsset] = useState("ETH")
  const [toAsset, setToAsset] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [isSwapping, setIsSwapping] = useState(false)

  const fromAssetData = assets.find((asset) => asset.symbol === fromAsset)
  const toAssetData = assets.find((asset) => asset.symbol === toAsset)

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromAssetData && toAssetData && fromAmount) {
      const rate = fromAssetData.price / toAssetData.price
      setExchangeRate(rate)
      setToAmount((Number(fromAmount) * rate).toFixed(6))
    } else {
      setToAmount("")
      setExchangeRate(0)
    }
  }, [fromAsset, toAsset, fromAmount, fromAssetData, toAssetData])

  const handleSwapAssets = () => {
    setIsSwapping(true)
    setTimeout(() => {
      const tempAsset = fromAsset
      const tempAmount = fromAmount
      setFromAsset(toAsset)
      setToAsset(tempAsset)
      setFromAmount(toAmount)
      setIsSwapping(false)
    }, 300)
  }

  const handleSwap = () => {
    if (fromAmount && toAmount) {
      console.log("Executing swap:", { fromAsset, toAsset, fromAmount, toAmount })
    }
  }

  const gasFee = 0.003 // ETH
  const gasFeeUSD = gasFee * 3890.75

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold animate-in slide-in-from-left duration-300">Swap</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Swap Interface */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* You Pay Card */}
        <Card className="p-4 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">You Pay</span>
            {fromAssetData && (
              <span className="text-xs text-muted-foreground">
                Balance: {fromAssetData.balance} {fromAsset}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Select value={fromAsset} onValueChange={setFromAsset}>
              <SelectTrigger className="w-32">
                <SelectValue>
                  {fromAssetData && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full bg-secondary flex items-center justify-center ${fromAssetData.color}`}
                      >
                        <span className="text-xs font-bold">{fromAssetData.logo}</span>
                      </div>
                      <span className="font-medium">{fromAsset}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {assets
                  .filter((asset) => asset.symbol !== toAsset)
                  .map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-secondary flex items-center justify-center ${asset.color}`}
                        >
                          <span className="text-xs font-bold">{asset.logo}</span>
                        </div>
                        <span className="font-medium">{asset.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 text-right text-xl font-bold border-none bg-transparent focus:ring-0"
            />
          </div>

          {fromAmount && fromAssetData && (
            <p className="text-right text-sm text-muted-foreground animate-in fade-in duration-300">
              ≈ ${(Number(fromAmount) * fromAssetData.price).toLocaleString()}
            </p>
          )}

          {fromAssetData && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-primary"
                onClick={() => setFromAmount(fromAssetData.balance.replace(",", ""))}
              >
                Max
              </Button>
            </div>
          )}
        </Card>

        {/* Swap Button */}
        <div className="flex justify-center lg:px-4">
          <Button
            onClick={handleSwapAssets}
            size="icon"
            className={cn(
              "rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300",
              isSwapping && "animate-spin",
            )}
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>

        {/* You Receive Card */}
        <Card className="p-4 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">You Receive</span>
            {toAssetData && (
              <span className="text-xs text-muted-foreground">
                Balance: {toAssetData.balance} {toAsset}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Select value={toAsset} onValueChange={setToAsset}>
              <SelectTrigger className="w-32">
                <SelectValue>
                  {toAssetData && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full bg-secondary flex items-center justify-center ${toAssetData.color}`}
                      >
                        <span className="text-xs font-bold">{toAssetData.logo}</span>
                      </div>
                      <span className="font-medium">{toAsset}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {assets
                  .filter((asset) => asset.symbol !== fromAsset)
                  .map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-secondary flex items-center justify-center ${asset.color}`}
                        >
                          <span className="text-xs font-bold">{asset.logo}</span>
                        </div>
                        <span className="font-medium">{asset.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex-1 text-right">
              <p className="text-xl font-bold animate-count-up">{toAmount ? Number(toAmount).toFixed(6) : "0.0"}</p>
            </div>
          </div>

          {toAmount && toAssetData && (
            <p className="text-right text-sm text-muted-foreground animate-in fade-in duration-300">
              ≈ ${(Number(toAmount) * toAssetData.price).toLocaleString()}
            </p>
          )}
        </Card>
      </div>

      {/* Exchange Rate & Fees */}
      {exchangeRate > 0 && (
        <Card className="p-4 space-y-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">
              1 {fromAsset} = {exchangeRate.toFixed(6)} {toAsset}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network Fee</span>
            <div className="text-right">
              <p className="text-sm font-medium">{gasFee} ETH</p>
              <p className="text-xs text-muted-foreground">≈ ${gasFeeUSD.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price Impact</span>
            <span className="text-sm font-medium text-green-400">{"<0.01%"}</span>
          </div>
        </Card>
      )}

      {/* Swap Button */}
      <Button
        onClick={handleSwap}
        disabled={!fromAmount || !toAmount}
        className="w-full h-14 text-lg font-semibold gradient-green-cyan hover:opacity-90 transition-all duration-200 active:scale-95"
      >
        {!fromAmount || !toAmount ? "Enter Amount" : `Swap ${fromAsset} for ${toAsset}`}
      </Button>

      {/* Recent Swaps */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Recent Swaps</h3>
        <div className="space-y-3">
          {[
            { from: "ETH", to: "USDC", amount: "0.5", time: "2 hours ago" },
            { from: "BTC", to: "SOL", amount: "0.001", time: "1 day ago" },
          ].map((swap, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    Ξ
                  </div>
                  <ArrowUpDown className="h-3 w-3 mx-1 text-muted-foreground" />
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">
                    $
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {swap.amount} {swap.from} → {swap.to}
                  </p>
                  <p className="text-xs text-muted-foreground">{swap.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

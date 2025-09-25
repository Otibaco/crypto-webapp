"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Scan, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const assets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.00234", logo: "₿", color: "text-orange-400" },
  { symbol: "ETH", name: "Ethereum", balance: "1.2456", logo: "Ξ", color: "text-blue-400" },
  { symbol: "SOL", name: "Solana", balance: "12.45", logo: "◎", color: "text-purple-400" },
  { symbol: "USDC", name: "USD Coin", balance: "1,250.00", logo: "$", color: "text-green-400" },
]

export function SendPage() {
  const [recipient, setRecipient] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!recipient.trim()) {
      newErrors.recipient = "Recipient address is required"
    } else if (recipient.length < 26) {
      newErrors.recipient = "Invalid wallet address"
    }

    if (!selectedAsset) {
      newErrors.asset = "Please select an asset"
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Invalid amount"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreviewTransaction = () => {
    if (validateForm()) {
      // Handle transaction preview
      console.log("Preview transaction:", { recipient, selectedAsset, amount })
    }
  }

  const selectedAssetData = assets.find((asset) => asset.symbol === selectedAsset)

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold animate-in slide-in-from-left duration-300">Send</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Address and Token Selector */}
        <div className="space-y-6">
          {/* Recipient Address */}
          <Card className="p-4 space-y-4">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Recipient Address
            </Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="Enter wallet address or ENS name"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value)
                  if (errors.recipient) {
                    setErrors((prev) => ({ ...prev, recipient: "" }))
                  }
                }}
                className={cn(
                  "pr-20 transition-all duration-200",
                  "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  errors.recipient && "border-destructive animate-shake",
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Scan className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {errors.recipient && (
              <div className="flex items-center gap-2 text-destructive text-sm animate-in slide-in-from-top duration-200">
                <AlertCircle className="h-4 w-4" />
                {errors.recipient}
              </div>
            )}
          </Card>

          {/* Asset Selection */}
          <Card className="p-4 space-y-4">
            <Label className="text-sm font-medium">Select Asset</Label>
            <Select
              value={selectedAsset}
              onValueChange={(value) => {
                setSelectedAsset(value)
                if (errors.asset) {
                  setErrors((prev) => ({ ...prev, asset: "" }))
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  "transition-all duration-200",
                  "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  errors.asset && "border-destructive",
                )}
              >
                <SelectValue placeholder="Choose cryptocurrency">
                  {selectedAssetData && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${selectedAssetData.color}`}
                      >
                        <span className="text-sm font-bold">{selectedAssetData.logo}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{selectedAssetData.symbol}</p>
                        <p className="text-xs text-muted-foreground">Balance: {selectedAssetData.balance}</p>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${asset.color}`}
                      >
                        <span className="text-sm font-bold">{asset.logo}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground">Balance: {asset.balance}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset && (
              <div className="flex items-center gap-2 text-destructive text-sm animate-in slide-in-from-top duration-200">
                <AlertCircle className="h-4 w-4" />
                {errors.asset}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Amount and Send Button */}
        <div className="space-y-6">
          {/* Amount Input */}
          <Card className="p-4 space-y-4">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: "" }))
                  }
                }}
                className={cn(
                  "text-2xl font-bold text-center transition-all duration-200",
                  "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  errors.amount && "border-destructive animate-shake",
                )}
              />
              {selectedAssetData && amount && (
                <p className="text-center text-sm text-muted-foreground animate-in fade-in duration-300">
                  ≈ ${(Number(amount) * 50000).toLocaleString()} USD
                </p>
              )}
              {selectedAssetData && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Available: {selectedAssetData.balance} {selectedAssetData.symbol}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-primary"
                    onClick={() => setAmount(selectedAssetData.balance.replace(",", ""))}
                  >
                    Max
                  </Button>
                </div>
              )}
            </div>
            {errors.amount && (
              <div className="flex items-center gap-2 text-destructive text-sm animate-in slide-in-from-top duration-200">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </div>
            )}
          </Card>

          {/* Transaction Fee */}
          {selectedAsset && amount && (
            <Card className="p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network Fee</span>
                <div className="text-right">
                  <p className="text-sm font-medium">0.0001 {selectedAsset}</p>
                  <p className="text-xs text-muted-foreground">≈ $5.00</p>
                </div>
              </div>
            </Card>
          )}

          {/* Preview Transaction Button */}
          <Button
            onClick={handlePreviewTransaction}
            className="w-full h-14 text-lg font-semibold gradient-purple-blue hover:opacity-90 transition-all duration-200 active:scale-95 animate-pulse"
            disabled={!recipient || !selectedAsset || !amount}
          >
            Preview Transaction
          </Button>
        </div>
      </div>
    </div>
  )
}

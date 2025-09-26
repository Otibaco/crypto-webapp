"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { CreditCard, Banknote, Shield, Zap } from "lucide-react"

export function BuyPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyCrypto = async () => {
    setIsLoading(true)
    // Simulate opening buy modal or redirect to payment provider
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // In a real app, this would open AppKit modal or redirect to payment provider
    alert("Buy crypto modal would open here (AppKit integration)")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full gradient-green-cyan glow-green flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Buy Crypto</h1>
            <p className="text-muted-foreground text-lg text-balance">
              Buy crypto directly in-app using your credit card or Coinbase account.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center space-y-2">
            <Zap className="h-6 w-6 text-primary mx-auto" />
            <p className="text-sm font-medium">Instant</p>
            <p className="text-xs text-muted-foreground">Get crypto immediately</p>
          </Card>
          <Card className="p-4 text-center space-y-2">
            <Shield className="h-6 w-6 text-accent mx-auto" />
            <p className="text-sm font-medium">Secure</p>
            <p className="text-xs text-muted-foreground">Bank-level security</p>
          </Card>
        </div>

        {/* Buy Button */}
        <div className="space-y-6">
          <Button
            onClick={handleBuyCrypto}
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold gradient-green-cyan glow-green hover:scale-105 active:scale-95 transition-all duration-200 md:h-16 md:text-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Opening...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Buy Crypto
              </div>
            )}
          </Button>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Supported payment methods</p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Credit Card</span>
              <span>•</span>
              <span>Debit Card</span>
              <span>•</span>
              <span>Coinbase</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Powered by trusted payment providers with competitive rates and low fees.
            </p>
            <p className="text-xs text-muted-foreground">KYC verification may be required for larger purchases.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

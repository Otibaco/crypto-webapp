"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Copy, Check, AlertTriangle, QrCode } from "lucide-react"

export function ReceivePage() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4"
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-foreground">Receive Crypto</h1>
        <p className="text-muted-foreground">Share your wallet address or QR code to receive payments</p>
      </div>

      {/* QR Code Card */}
      <Card className="p-6 space-y-4 glow-purple">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-center">
          {/* QR Code */}
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center glow-cyan md:w-56 md:h-56">
            <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center md:w-48 md:h-48">
              <QrCode className="h-32 w-32 text-white md:h-40 md:w-40" />
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4 text-center md:text-left md:flex-1 md:max-w-sm">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Your Wallet Address</p>
              <div className="space-y-3">
                <p className="text-lg font-mono text-foreground break-all md:text-base">{walletAddress}</p>
                <p className="text-sm text-muted-foreground md:hidden">Tap to copy: {truncatedAddress}</p>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={copyAddress}
              className="w-full gradient-green-cyan glow-green hover:scale-105 active:scale-95 transition-all duration-200 md:w-auto"
            >
              {copied ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Copied!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Address
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Safety Warning */}
      <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-500">Important Safety Notice</p>
            <p className="text-sm text-muted-foreground">
              Only send ETH to this address on the Ethereum network. Sending other assets or using different networks
              may result in permanent loss of funds.
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="space-y-4 text-center">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Network</p>
            <p className="text-xs text-muted-foreground">Ethereum Mainnet</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Supported Assets</p>
            <p className="text-xs text-muted-foreground">ETH, ERC-20 Tokens</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Confirmations</p>
            <p className="text-xs text-muted-foreground">12 blocks required</p>
          </div>
        </div>
      </div>
    </div>
  )
}

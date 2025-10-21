// components/receive-page.jsx
"use client"

import { useState } from "react"
import { useAccount } from 'wagmi'
import { useSearchParams } from 'next/navigation'
// CORRECTED IMPORT: Use { QRCodeCanvas } for qrcode.react
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Copy, Check, AlertTriangle } from "lucide-react"

export function ReceivePage({ walletAddress, chainName, onClose }) {
  const [copied, setCopied] = useState(false)
  const { address: connectedAddress, chainId } = useAccount()
  const searchParams = useSearchParams()

  // Map chainId to network name
  const CHAIN_ID_TO_NAME = {
    1: 'Ethereum Mainnet',
    56: 'BNB Smart Chain',
    137: 'Polygon',
    43114: 'Avalanche',
    250: 'Fantom',
    10: 'Optimism',
    42161: 'Arbitrum',
    8453: 'Base',
  }

  // Support address passed via prop, query param (?address=), or connected wallet
  const queryAddress = typeof searchParams?.get === 'function' ? searchParams.get('address') : null
  const effectiveAddress = walletAddress || queryAddress || connectedAddress || null
  // Use chainId from wagmi, or fallback to query param or prop
  const queryChainId = typeof searchParams?.get === 'function' ? Number(searchParams.get('chainId')) : null
  const effectiveChainId = chainId || queryChainId || null
  const effectiveChainName = CHAIN_ID_TO_NAME[effectiveChainId] || 'Unknown Network'

  // If we don't have an address from any source, show a helpful error
  if (!effectiveAddress) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 mx-auto text-red-500" />
        <h1 className="text-xl font-bold">Error Loading Address</h1>
        <p className="text-muted-foreground">The wallet address was not provided to the page. Connect your wallet or pass an <code>?address=</code> query parameter.</p>
        {onClose && (
          <Button onClick={onClose} className="mt-4">Go Back</Button>
        )}
      </div>
    )
  }

  const displayAddress = effectiveAddress
  const displayChainName = effectiveChainName
  const truncatedAddress = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`

  const copyAddress = async () => {
    if (!displayAddress || displayAddress.startsWith('0x0000')) return

    try {
      await navigator.clipboard.writeText(displayAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-foreground">Receive {displayChainName}</h1>
        <p className="text-muted-foreground">Share your wallet address or QR code to receive payments</p>
      </div>

      {/* QR Code Card */}
      <Card className="p-6 space-y-4 glow-purple">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-center">
          {/* QR Code - FIX: Using <QRCodeCanvas /> */}
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center glow-cyan md:w-56 md:h-56">
            <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center p-2 md:w-48 md:h-48">
              <QRCodeCanvas
                value={displayAddress} // Uses the dynamic address prop
                size={160}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4 text-center md:text-left md:flex-1 md:max-w-sm">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Your Wallet Address</p>
              <div className="space-y-3">
                <p className="text-lg font-mono text-foreground break-all md:text-base">{displayAddress}</p>
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
              Only send assets compatible with the <b>{displayChainName}</b> network to this address. Sending other assets or using different networks
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
            <p className="text-xs text-muted-foreground">{displayChainName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Supported Assets</p>
            <p className="text-xs text-muted-foreground">Native Coin, ERC-20 Tokens</p>
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
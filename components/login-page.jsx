"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    // In a real app, this would redirect to dashboard after successful connection
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* App Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full gradient-purple-blue glow-purple flex items-center justify-center">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome to 2sweet</h1>
            <p className="text-muted-foreground text-lg">Connect your wallet to get started.</p>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="space-y-6">
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full h-14 text-lg font-semibold gradient-purple-blue glow-purple hover:scale-105 active:scale-95 transition-all duration-200 md:h-16 md:text-xl"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              "Connect Wallet"
            )}
          </Button>

          {/* Additional Info */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Secure</span>
              <span>•</span>
              <span>Decentralized</span>
              <span>•</span>
              <span>Non-custodial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

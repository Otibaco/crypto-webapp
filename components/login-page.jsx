"use client";

import { Wallet } from "lucide-react";
import Link from 'next/link'; // Import Link for navigation

// Note: We no longer need the 'Button' component from 'shadcn/ui'
// and the custom state for handling the connection.

// Corrected to be a default export, as required by Next.js App Router
export default function LoginPage() {
  // AppKit handles the connection state internally, so we remove the
  // `isConnecting` state and the `handleConnectWallet` function.

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
        <div className="space-y-6 ">
          {/* Centered Connect Wallet Button */}
          <div className="flex justify-center">
            <appkit-button />
          </div>


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

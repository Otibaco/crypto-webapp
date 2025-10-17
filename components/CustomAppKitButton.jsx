"use client"

import React, { useState, useEffect } from "react"
import { modal } from "../context" // adjust if path differs
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { Wallet } from "lucide-react"
import { Button } from "../components/ui/button"

export default function CustomAppKitButton() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address, enabled: !!address })
  const { disconnect } = useDisconnect()
  const [loading, setLoading] = useState(false)

  // ✅ Sync wallet connection status to cookie
  useEffect(() => {
    if (isConnected) {
      document.cookie = "wallet_connected=true; path=/; max-age=86400"
    } else {
      document.cookie = "wallet_connected=false; path=/; max-age=86400"
    }
  }, [isConnected])

  const handleConnect = async () => {
    try {
      setLoading(true)
      await modal.open() // Trigger Reown WalletConnect logic
    } catch (err) {
      console.error("Wallet connect error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      disconnect()
      document.cookie = "wallet_connected=false; path=/; max-age=86400"
    } catch (err) {
      console.error("Disconnect error:", err)
    }
  }

  return (
    <div className="flex items-center justify-center">
      {!isConnected ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
        >
          <Wallet className="w-5 h-5" />
          {loading ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="flex items-center gap-2 text-[#22c55e] border-[#22c55e] px-6 py-3 rounded-lg text-base font-medium hover:bg-[#22c55e]/10 transition-all duration-300"
        >
          <Wallet className="w-5 h-5" />
          {balanceData
            ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
            : address?.slice(0, 6) + "..." + address?.slice(-4)}
        </Button>
      )}
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { modal } from "../context" // adjust path if needed
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { Wallet } from "lucide-react"
import { Button } from "../components/ui/button"

export default function CustomAppKitButton() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address, enabled: !!address })
  const { disconnect } = useDisconnect()
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setLoading(true)
      await modal.open() // Opens Reown’s wallet connect logic (not their UI)
    } catch (err) {
      console.error("Wallet connect error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      disconnect()
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

"use client"

import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppKitAccount } from "@reown/appkit/react"
import { useEffect } from "react"

export default function LoginPage() {
  const { isConnected, address } = useAppKitAccount() // ✅ include address
  const router = useRouter()

  useEffect(() => {
    if (isConnected && address) {
      // set cookie with wallet address
      document.cookie = `auth_token=${address}; path=/;`
      router.push("/") // redirect to dashboard (your home page)
    }
  }, [isConnected, address, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full gradient-purple-blue glow-purple flex items-center justify-center">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to 2sweet</h1>
          <p className="text-muted-foreground text-lg">
            Connect your wallet to get started.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          {/* AppKit handles the connection */}
          <appkit-button />
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          By connecting, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  )
}

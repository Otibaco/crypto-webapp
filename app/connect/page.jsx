"use client"

import { motion } from "framer-motion"
import CustomAppKitButton from "../../components/CustomAppKitButton"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConnectPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  // ✅ Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full flex flex-col items-center space-y-8"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-2">
          <img src="/logo2.png" alt="Logo" className="h-12 w-12 mr-2" />
          <span className="text-3xl font-black gradient-text">2$weet</span>
        </Link>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold">Connect Your Wallet</h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-lg">
          Please connect your Ethereum wallet to access your dashboard and manage your assets securely.
        </p>

        {/* Connect Button */}
        <div className="mt-4">
          <CustomAppKitButton />
        </div>

        {/* Go Back */}
        <Link
          href="/"
          className="text-sm text-primary hover:underline mt-6"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

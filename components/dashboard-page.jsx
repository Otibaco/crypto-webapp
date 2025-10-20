"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useAccount, useBalance } from "wagmi"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { ArrowUp, ArrowDown, ArrowUpDown, ShoppingCart } from "lucide-react"
import Link from "next/link"

const TOKENS = [
  { symbol: "ETH", chainId: 1, cgId: "ethereum", isNative: true },
  { symbol: "BNB", chainId: 56, cgId: "binancecoin", isNative: true },
  { symbol: "MATIC", chainId: 137, cgId: "polygon", isNative: true },
  { symbol: "AVAX", chainId: 43114, cgId: "avalanche-2", isNative: true },
  { symbol: "FTM", chainId: 250, cgId: "fantom", isNative: true },
  { symbol: "OP", chainId: 10, cgId: "optimism", isNative: true },
  { symbol: "ARB", chainId: 42161, cgId: "arbitrum", isNative: true },
  { symbol: "BASE", chainId: 8453, cgId: "base", isNative: true },
  {
    symbol: "USDT",
    chainId: 1,
    cgId: "tether",
    isNative: false,
    addresses: { "1": "0xdAC17F958D2ee5237c95619A80b8b20e0605a96A" },
  },
  {
    symbol: "USDC",
    chainId: 1,
    cgId: "usd-coin",
    isNative: false,
    addresses: { "1": "0xA0b86991c6218b36c1d19D4a2e9eb0cE3606eB48" },
  },
]

const COINGECKO_IDS = TOKENS.map((t) => t.cgId).filter(Boolean).join(",")

const ASSET_LOGOS = {
  ETH: "/ethereum-eth-logo.png",
  BNB: "/bnb-bnb-logo.png",
  MATIC: "/polygon-matic-logo.png",
  AVAX: "/avalanche-avax-logo.png",
  FTM: "/fantom-ftm-logo.png",
  OP: "/optimism-ethereum-op-logo.png",
  ARB: "/arbitrum-arb-logo.png",
  BASE: "/base-logo.png",
  USDT: "/tether-usdt-logo.png",
  USDC: "/usd-coin-usdc-logo.png",
}

function formatUsd(n) {
  return `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [prices, setPrices] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get all balances at once using useBalance
  const balanceResults = TOKENS.map(token => {
    const tokenAddress = token.addresses
      ? token.addresses[String(token.chainId)] || token.addresses["1"]
      : undefined

    return useBalance({
      address,
      token: token.isNative ? undefined : tokenAddress,
      chainId: token.chainId,
      watch: true,
      enabled: !!address,
    })
  })

  // Create balances object from results
  const balances = TOKENS.reduce((acc, token, index) => {
    const balance = balanceResults[index].data
      ? Number(balanceResults[index].data.formatted)
      : 0
    return { ...acc, [token.symbol]: balance }
  }, {})

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
        COINGECKO_IDS
      )}&vs_currencies=usd&include_24hr_change=true`
      const res = await fetch(url)
      if (!res.ok) throw new Error("CoinGecko fetch failed")
      const data = await res.json()
      setPrices(data)
    } catch (err) {
      setError("Failed to fetch prices")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isConnected) fetchPrices()
  }, [isConnected, fetchPrices])

  // -------- TOKEN ROW -------- //
  function TokenRow({ token }) {
    const balance = balances[token.symbol] || 0
    const priceObj = prices[token.cgId] || { usd: 0, usd_24h_change: 0 }
    const usdValue = balance * (priceObj.usd || 0)
    const percentChange = priceObj.usd_24h_change || 0
    const percentColor =
      percentChange > 0
        ? "text-green-500"
        : percentChange < 0
        ? "text-red-500"
        : "text-gray-400"

    return (
      <Card className="p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 min-h-[3.5rem] sm:min-h-[6rem] flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Mobile Layout */}
        <div className="flex w-full items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <img
              src={ASSET_LOGOS[token.symbol]}
              alt={token.symbol}
              className="w-6 h-6 rounded-full border bg-white object-contain"
            />
            <span className="font-semibold text-sm">{token.symbol}</span>
          </div>

          <div className="flex flex-col items-end text-right leading-tight">
            <span className="text-xs font-medium">
              {balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
              {token.symbol}
            </span>
            <span className="text-[10px] text-gray-500">
              {formatUsd(priceObj.usd)} / {token.symbol}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs">{formatUsd(usdValue)}</span>
              <span className={`text-[10px] ${percentColor}`}>
                {percentChange > 0 ? "+" : ""}
                {percentChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={ASSET_LOGOS[token.symbol]}
              alt={token.symbol}
              className="w-9 h-9 rounded-full border bg-white object-contain"
            />
            <div>
              <span className="font-semibold text-lg">{token.symbol}</span>
              <div className="text-sm text-gray-500">
                {balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
                {token.symbol}
              </div>
              <div className="text-xs text-gray-400">
                {formatUsd(priceObj.usd)} / {token.symbol}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-medium text-sm">{formatUsd(usdValue)}</div>
            <div className={`text-sm ${percentColor}`}>
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // ---- TOTAL BALANCE CALC ---- //
  const totalUsd = TOKENS.reduce((sum, t) => {
    const price = prices[t.cgId]?.usd || 0
    const bal = balances[t.symbol] || 0
    return sum + bal * price
  }, 0)

  const totalChange = (() => {
    let totalValue = 0,
      weightedChange = 0
    TOKENS.forEach((t) => {
      const p = prices[t.cgId] || { usd: 0, usd_24h_change: 0 }
      const bal = balances[t.symbol] || 0
      const value = bal * (p.usd || 0)
      totalValue += value
      weightedChange += (value * (p.usd_24h_change || 0)) / 100
    })
    return totalValue ? (weightedChange / totalValue) * 100 : 0
  })()

  return (
    <div className="p-3 sm:p-5 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 break-all">
            {address
              ? `Welcome, ${address.slice(0, 6)}...${address.slice(-4)}`
              : "Wallet not connected"}
          </p>
        </div>
        <Button
          onClick={fetchPrices}
          disabled={!isConnected || isLoading}
          className="self-start sm:self-center"
        >
          Refresh
        </Button>
      </div>

      {/* Total Portfolio */}
      <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white text-center">
        <p className="text-white/80 text-xs sm:text-sm mb-1">
          Total Portfolio Value (USD)
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          {formatUsd(totalUsd)}
        </h2>
        <p
          className={`text-sm sm:text-base font-semibold ${
            totalChange > 0
              ? "text-green-400"
              : totalChange < 0
              ? "text-red-400"
              : "text-white/80"
          }`}
        >
          {totalChange > 0 ? "+" : ""}
          {totalChange.toFixed(2)}% today
        </p>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/send", icon: <ArrowUp />, label: "Send" },
          { href: "/dashboard/receive", icon: <ArrowDown />, label: "Receive" },
          { href: "/dashboard/swap", icon: <ArrowUpDown />, label: "Swap" },
          { href: "/dashboard/buy", icon: <ShoppingCart />, label: "Buy" },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <Button className="h-14 sm:h-16 flex flex-col justify-center items-center gap-1 bg-secondary hover:bg-secondary/80 rounded-xl shadow-md w-full">
              {React.cloneElement(action.icon, {
                className: "h-5 w-5 sm:h-6 sm:w-6 text-primary",
              })}
              <span className="text-xs sm:text-sm">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {TOKENS.map((token) => (
          <TokenRow key={token.symbol} token={token} />
        ))}
      </div>

      {error && <Card className="p-3 text-red-500">{error}</Card>}
    </div>
  )
}

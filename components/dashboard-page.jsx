"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAccount, useChainId } from "wagmi"
import axios from "axios"
import { formatUnits } from "viem"

// --- CONFIGURATION CONSTANTS ---
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY
// Moralis supports chain IDs directly. We focus on EVM chains with token data.
const SUPPORTED_CHAIN_IDS = [
    '0x1',      // Ethereum Mainnet
    '0x89',     // Polygon Mainnet
    '0x38',     // BNB Smart Chain (BSC)
    // Solana requires a separate endpoint in Moralis. For simplicity 
    // and combined data, we stick to EVM chains for this combined asset list.
]

// Helper to convert chain ID to a friendly name for display
const CHAIN_ID_TO_NAME = {
    '0x1': 'ETH',
    '0x89': 'POLYGON',
    '0x38': 'BSC',
}

// Dummy mapping for colors/logos (kept for UI presentation)
const ASSET_VISUALS = {
    "ETH": { logo: "Ξ", color: "text-purple-400" },
    "MATIC": { logo: "P", color: "text-purple-600" },
    "BNB": { logo: "B", color: "text-yellow-400" },
    "USDC": { logo: "$", color: "text-blue-500" },
    "USDT": { logo: "$", color: "text-green-500" },
    "DAI": { logo: "Ð", color: "text-yellow-300" },
    "WETH": { logo: "Ξ", color: "text-purple-400" },
}

// --- Custom Hook to Fetch Data (USING MORALIS) ---
const useAllTokenBalances = (address) => {
    const [data, setData] = useState([])
    const [totalBalance, setTotalBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        if (!address) return
        
        if (!MORALIS_API_KEY) {
            setError("API Key Missing. Please set NEXT_PUBLIC_MORALIS_API_KEY.")
            return
        }

        setIsLoading(true)
        setError(null)

        const headers = {
            'accept': 'application/json',
            'X-API-Key': MORALIS_API_KEY 
        }

        let allAssets = [];
        let totalUSD = 0;

        try {
            // Loop through each chain to get token balances and prices
            for (const chainId of SUPPORTED_CHAIN_IDS) {
                const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens`

                const response = await axios.get(url, {
                    headers: headers,
                    params: {
                        'chain': chainId,
                        'exclude_spam': true,
                        'exclude_native': false,
                        'limit': 100 // Get up to 100 tokens per chain
                    }
                })

                // Process assets from the current chain
                const chainAssets = response.data.result.map(item => {
                    const balanceBigInt = BigInt(item.balance)
                    
                    // Skip if balance is zero or null, or if it's spam (Moralis provides this flag)
                    if (balanceBigInt === 0n || item.possible_spam === true) return null

                    const formattedBalance = Number(formatUnits(balanceBigInt, item.decimals || 18))
                    const priceUSD = item.usdValue || 0
                    const assetValue = formattedBalance * priceUSD

                    // Extract 24-hour change provided by Moralis
                    let changePercentage = "0.0%"
                    
                    if (item.usdPrice24hrPercentChange) {
                        const change = item.usdPrice24hrPercentChange
                        changePercentage = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
                    }

                    totalUSD += assetValue

                    const symbol = item.symbol || 'NATIVE'
                    const visuals = ASSET_VISUALS[symbol] || { logo: 'A', color: 'text-gray-400' }

                    return {
                        symbol: symbol,
                        name: item.name || item.symbol,
                        balance: formattedBalance,
                        price: priceUSD,
                        totalValue: assetValue,
                        change: changePercentage,
                        logo: visuals.logo,
                        color: visuals.color,
                        chain_name: CHAIN_ID_TO_NAME[chainId] || chainId,
                    }
                }).filter(Boolean) // Remove null entries (spam/zero balance)

                allAssets = [...allAssets, ...chainAssets]
            }

            // Filter out dust amounts and set data
            setData(allAssets.filter(asset => asset.totalValue > 0.01)) 
            setTotalBalance(totalUSD)

        } catch (err) {
            console.error("Error fetching token balances from Moralis:", err.response ? err.response.data : err)
            
            let userMessage = "Failed to fetch assets. Please check your network or try again."
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    userMessage = "Authentication failed (401/403). Check if your Moralis API key is correct and active."
                }
            }
            setError(userMessage)
        } finally {
            setIsLoading(false)
        }
    }, [address])

    useEffect(() => {
        // Initial fetch and set up interval for "real-time" update (every 15 seconds)
        fetchData()
        const intervalId = setInterval(fetchData, 15000); 

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [fetchData])

    return { data, totalBalance, isLoading, error, refetch: fetchData }
}

// --- Main Component ---
export function DashboardPage() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()

    const { data: assets, totalBalance, isLoading, error, refetch } = useAllTokenBalances(address)

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-muted-foreground text-center">
                    Please connect your wallet to view your dashboard.
                </p>
            </div>
        )
    }

    // A basic loading and error state
    const renderContent = () => {
        if (isLoading && assets.length === 0) {
            return (
                <div className="p-4 flex flex-col items-center space-y-4">
                    <DollarSign className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading assets across all chains...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="p-4 text-center">
                    <p className="text-red-500 font-semibold mb-2">{error}</p>
                    <Button onClick={refetch} variant="outline">
                        Try Again
                    </Button>
                </div>
            )
        }

        if (assets.length === 0 && !isLoading) {
            return (
                <div className="p-4 text-center">
                    <p className="text-muted-foreground">No assets found in your wallet on the connected chains.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Supported Chains: ETH, Polygon, BSC.
                        Connected Address: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <Button onClick={refetch} variant="ghost" className="mt-2">
                        Refresh
                    </Button>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Assets</h3>
                    <Button variant="ghost" size="sm" onClick={refetch} className="text-primary">
                        Refresh
                    </Button>
                </div>

                <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:space-y-3">
                    {assets.map((asset, index) => (
                        <Card
                            key={`${asset.symbol}-${asset.chain_name}`}
                            className="p-4 hover:bg-secondary/50 transition-colors duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center glow-purple ${asset.color}`}
                                    >
                                        <span className="text-lg font-bold">{asset.logo}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{asset.symbol}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {asset.name} on {asset.chain_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold">
                                        {asset.balance.toLocaleString("en-US", { maximumFractionDigits: 6 })} {asset.symbol}
                                    </p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <p className="text-sm text-muted-foreground">
                                            ${asset.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        {/* Use change data provided by Moralis */}
                                        <span className={`text-xs ${asset.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                                            {asset.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pt-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Wallet: {address?.slice(0, 6)}...{address?.slice(-4)} | Chain ID: {chainId}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full gradient-purple-blue flex items-center justify-center">
                    <span className="text-white font-bold">CW</span>
                </div>
            </div>

            {/* Total Balance Card */}
            <Card className="p-6 gradient-purple-blue glow-purple">
                <div className="text-center space-y-2">
                    <p className="text-white/80 text-sm">Total Portfolio Value (USD)</p>
                    <h2 className="text-3xl font-bold text-white">
                        ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    {/* Placeholder is still here, as calculating total 24h P&L is complex */}
                    <p className="text-white/80 text-sm">
                        {isLoading ? "Fetching 24h change..." : "+$X.XX (+X.X%) today (Requires 24h data aggregation)"}
                    </p>
                </div>
            </Card>

            {/* Action Buttons (Using original dummy structure for navigation) */}
            <div className="grid grid-cols-4 gap-3 md:grid-cols-4 md:gap-4 lg:max-w-md lg:mx-auto">
                <Link href="/send" passHref>
                    <Button asChild className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
                        <div>
                            <ArrowUp className="h-5 w-5 text-primary md:h-6 md:w-6" />
                            <span className="text-xs md:text-sm">Send</span>
                        </div>
                    </Button>
                </Link>
                <Link href="/receive" passHref>
                    <Button asChild className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
                        <div>
                            <ArrowDown className="h-5 w-5 text-accent md:h-6 md:w-6" />
                            <span className="text-xs md:text-sm">Receive</span>
                        </div>
                    </Button>
                </Link>
                <Link href="/swap" passHref>
                    <Button asChild className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
                        <div>
                            <ArrowUpDown className="h-5 w-5 text-chart-3 md:h-6 md:w-6" />
                            <span className="text-xs md:text-sm">Swap</span>
                        </div>
                    </Button>
                </Link>
                <Link href="/buy" passHref>
                    <Button asChild className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
                        <div>
                            <ShoppingCart className="h-5 w-5 text-chart-4 md:h-6 md:w-6" />
                            <span className="text-xs md:text-sm">Buy</span>
                        </div>
                    </Button>
                </Link>
            </div>
            
            {/* Your Assets */}
            {renderContent()}

            {/* Transaction History Shortcut */}
            <Link href="/history" passHref>
                <Card className="p-4 hover:bg-secondary/50 transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Transaction History</p>
                                <p className="text-sm text-muted-foreground">View all transactions</p>
                            </div>
                        </div>
                        <ArrowUp className="h-4 w-4 text-muted-foreground rotate-45" />
                    </div>
                </Card>
            </Link>
        </div>
    )
}
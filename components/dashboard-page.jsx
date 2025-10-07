"use client"

import { useState, useEffect, useCallback } from "react"
// NOTE: I'm assuming these components and libraries are installed in your Next.js environment.
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAccount, useChainId } from "wagmi"
import axios from "axios" // Used for client-side fetching from the local API route


// --- CONFIGURATION CONSTANTS (Client-side) ---

// ✅ Same chains as in wagmi.config.ts
const SUPPORTED_CHAIN_IDS = [
    '0x1',        // Ethereum Mainnet
    '0xaa36a7',   // Sepolia Testnet
    '0xa4b1',     // Arbitrum
    '0xa',        // Optimism
    '0x2105',     // Base
    '0x144',      // zkSync Era
    '0xe708',     // Linea
    '0x89',       // Polygon
    '0x38',       // BNB Smart Chain
]

const CHAIN_ID_TO_NAME = {
    '0x1': 'ETH',
    '0xaa36a7': 'SEPOLIA',
    '0xa4b1': 'ARBITRUM',
    '0xa': 'OPTIMISM',
    '0x2105': 'BASE',
    '0x144': 'ZKSYNC',
    '0xe708': 'LINEA',
    '0x89': 'POLYGON',
    '0x38': 'BSC',
}

// ✅ Token visuals (native + stablecoins)
const ASSET_VISUALS = {
    'ETH': { color: 'text-purple-400' },
    'SEPOLIAETH': { color: 'text-gray-400' },
    'ARB': { color: 'text-blue-400' },
    'OP': { color: 'text-red-400' },
    'BASE': { color: 'text-blue-500' },
    'ZKSYNC': { color: 'text-green-400' },
    'LINEA': { color: 'text-indigo-400' },
    'MATIC': { color: 'text-purple-600' },
    'BNB': { color: 'text-yellow-400' },
    'AVAX': { color: 'text-red-500' },
    'FTM': { color: 'text-blue-300' },

    // ✅ Stablecoins & wrapped assets
    'USDC': { color: 'text-blue-500' },
    'USDT': { color: 'text-green-500' },
    'DAI': { color: 'text-yellow-300' },
    'WETH': { color: 'text-purple-400' },
}

// Helper to get color styling from the client-side map
const getAssetColor = (symbol) => {
    return ASSET_VISUALS[symbol]?.color || 'text-gray-400';
}


// --- Custom Hook to Fetch Data (USING LOCAL API) ---
const useAllTokenBalances = (address) => {
    const [data, setData] = useState([])
    const [totalBalance, setTotalBalance] = useState(0)
    const [totalChangeUSD, setTotalChangeUSD] = useState(0)
    const [totalChangePercent, setTotalChangePercent] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        if (!address) return

        setIsLoading(true)
        setError(null)

        try {
            // **UPDATED**: Call the new server-side API endpoint
            const url = `/api/dashboard-data?address=${address}`

            const response = await axios.get(url)

            // Check for structured error from the server route
            if (response.data.error) {
                throw new Error(response.data.error)
            }

            const apiData = response.data;

            // Map the API data to re-integrate client-side styling/visuals
            const mappedData = apiData.data.map(asset => {
                const color = getAssetColor(asset.symbol);
                return {
                    ...asset,
                    color: color,
                };
            });


            setData(mappedData)
            setTotalBalance(apiData.totalBalance)
            setTotalChangeUSD(apiData.totalChangeUSD)
            setTotalChangePercent(apiData.totalChangePercent)

        } catch (err) {
            console.error("Error fetching token balances from local API:", err.response ? err.response.data : err.message)

            let userMessage = "Failed to fetch assets. Please try again."
            // If the error comes from the server, use its message
            if (err.response && err.response.data && err.response.data.error) {
                userMessage = err.response.data.error;
            } else if (err.message) {
                userMessage = err.message;
            }

            setError(userMessage)

            setTotalChangeUSD(0)
            setTotalChangePercent(0)
            setTotalBalance(0)
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [address])

    useEffect(() => {
        fetchData()
        // Set up the interval for refreshing data every 15 seconds
        const intervalId = setInterval(fetchData, 15000);

        return () => clearInterval(intervalId);
    }, [fetchData])

    return { data, totalBalance, totalChangeUSD, totalChangePercent, isLoading, error, refetch: fetchData }
}


// --- Main Component ---
export function DashboardPage() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()

    const { data: assets, totalBalance, totalChangeUSD, totalChangePercent, isLoading, error, refetch } = useAllTokenBalances(address)

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-muted-foreground text-center">
                    Please connect your wallet to view your dashboard.
                </p>
               
                    {/* AppKit handles the connection */}
                    <appkit-button />
            </div>
        )
    }

    // Format chain ID from number to hex string for display/lookup
    const displayChainId = `0x${chainId.toString(16)}`

    // Get the current chain name for the safety notice in the Receive page
    const currentChainName = CHAIN_ID_TO_NAME[displayChainId] || 'Ethereum Mainnet';

    // Helper function to format the total change line
    const formatTotalChange = () => {
        const changeUSD = Math.abs(totalChangeUSD).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const changePercent = Math.abs(totalChangePercent).toFixed(2)

        const sign = totalChangeUSD >= 0 ? '+' : ''

        return `${sign}$${changeUSD} (${sign}${changePercent}%) today`
    }

    // A basic loading and error state rendering function
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

        const supportedChainNames = SUPPORTED_CHAIN_IDS.map(id => CHAIN_ID_TO_NAME[id] || id).join(', ')

        if (assets.length === 0 && !isLoading) {
            return (
                <div className="p-4 text-center">
                    <p className="text-muted-foreground">No EVM assets found in your wallet on the connected chains.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        **Max EVM Coverage:** {supportedChainNames}.
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
                    <h3 className="text-lg font-semibold">Your EVM Assets</h3>
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
                                        {/* Display 'No price' for zero-value assets (e.g., testnets) */}
                                        <p className="text-sm text-muted-foreground">
                                            {asset.totalValue > 0.01
                                                ? `$${asset.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : "No price available"}
                                        </p>
                                        {asset.totalValue > 0.01 && (
                                            <span className={`text-xs ${asset.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                                                {asset.change}
                                            </span>
                                        )}
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
                        Wallet: {address?.slice(0, 6)}...{address?.slice(-4)} | Chain ID: {displayChainId}
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

                    {/* IMPLEMENTED 24h CHANGE LINE */}
                    <p className={`text-sm ${totalChangeUSD > 0.01 ? 'text-green-300' : totalChangeUSD < -0.01 ? 'text-red-400' : 'text-white/80'}`}>
                        {isLoading
                            ? "Fetching 24h change..."
                            : totalBalance > 0.01 || (totalBalance > 0 && totalChangeUSD !== 0)
                                ? formatTotalChange()
                                : "No meaningful price data for 24h change"}
                    </p>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3 md:grid-cols-4 md:gap-4 lg:max-w-md lg:mx-auto">
                <Link href="/send" passHref>
                    <Button asChild className="h-16 w-full flex flex-col gap-1 bg-secondary hover:bg-secondary/80 active:scale-95 transition-all duration-200 md:h-20">
                        <div>
                            <ArrowUp className="h-5 w-5 text-primary md:h-6 md:w-6" />
                            <span className="text-xs md:text-sm">Send</span>
                        </div>
                    </Button>
                </Link>
                <Link
                    href={{
                        pathname: "/receive",
                        query: {
                            address: address, // Pass the connected wallet address
                            chain: currentChainName // Pass the current connected chain name
                        }
                    }}
                    passHref
                >
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

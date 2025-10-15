"use client"

import { useState, useMemo } from "react"
// Assuming these UI components are defined elsewhere (e.g., shadcn/ui)
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowLeft, ArrowUp, ArrowDown, ArrowUpDown, ExternalLink, Search } from "lucide-react"
import { Input } from "../components/ui/input"
import Link from "next/link"
import { cn } from "../lib/utils"
import { format } from 'date-fns';
import { BottomNavigation } from "./bottom-navigation"

// Helper function to format value from Moralis (which is in WEI)
const formatWeiValue = (value, chain) => {
    // Moralis transaction value is native coin amount in WEI.
    const decimal = 18; // Assume 18 decimals for most EVM coins (ETH, BNB, MATIC)
    
    try {
        // Use BigInt for high precision handling
        const valueBigInt = BigInt(value || '0');
        const divisor = BigInt(10) ** BigInt(decimal);
        
        const integerPart = valueBigInt / divisor;
        const fractionPart = valueBigInt % divisor;
        
        // Pad the fractional part to 4 decimals for display
        const fractionString = fractionPart.toString().padStart(decimal, '0').slice(0, 4);
        
        return `${integerPart}.${fractionString} ${chain.toUpperCase()}`;
    } catch (e) {
        // Fallback for environments that don't fully support BigInt in arithmetic
        const amount = Number(value || '0') / (10 ** 18);
        return `${amount.toFixed(4)} ${chain.toUpperCase()}`;
    }
};

// Helper function to get the block explorer link
const getExplorerLink = (hash, chain) => {
    const chainExplorers = {
        'eth': 'https://etherscan.io/tx/',
        'polygon': 'https://polygonscan.com/tx/',
        'bsc': 'https://bscscan.com/tx/',
        'arbitrum': 'https://arbiscan.io/tx/',
        'base': 'https://basescan.org/tx/',
    };
    const explorerBase = chainExplorers[chain] || 'https://etherscan.io/tx/';
    return `${explorerBase}${hash}`;
};

// IMPORTANT: This component now accepts the walletAddress prop
export function HistoryPage({ initialTransactions, walletAddress }) {
    const [activeFilter, setActiveFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    
    // Moralis transactions do not include USD value or type, we have to infer/enrich them.
    const enrichedTransactions = useMemo(() => {
        if (!initialTransactions || !walletAddress) return [];

        const walletLower = walletAddress.toLowerCase();

        return initialTransactions.map(tx => {
            
            // CRITICAL FIX: Determine SENT vs. RECEIVED by checking against the connected wallet address
            const type = (tx.from_address.toLowerCase() === walletLower) ? "sent" : "received"; 
            
            // Determine the counterparty address
            const counterparty = type === "sent" ? tx.to_address : tx.from_address;

            return {
                id: tx.hash,
                type: type, 
                asset: tx.chain.toUpperCase(),
                amount: tx.value,
                // USD value is not provided by this endpoint, requires another Moralis call.
                value: 0, 
                address: counterparty, // Use the correct counterparty
                date: tx.block_timestamp ? format(new Date(tx.block_timestamp), 'MMM dd, yyyy') : 'N/A',
                time: tx.block_timestamp ? format(new Date(tx.block_timestamp), 'h:mm a') : 'N/A',
                status: 'completed', // Moralis only returns completed transactions here
                hash: tx.hash,
                chain: tx.chain
            };
        });
    }, [initialTransactions, walletAddress]);


    const filteredTransactions = enrichedTransactions.filter((tx) => {
        // NOTE: Swaps are not supported by the current Moralis endpoint, but we keep the filter logic
        const matchesFilter = activeFilter === "all" || tx.type === activeFilter
        const matchesSearch =
            searchQuery === "" ||
            tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    // ... (getTransactionIcon and getStatusColor functions remain the same)
    const getTransactionIcon = (type, status) => {
        const iconClass = cn(
            "h-5 w-5",
            status === "completed" && type === "sent" && "text-red-400",
            status === "completed" && type === "received" && "text-green-400",
            status === "completed" && type === "swap" && "text-blue-400",
            status === "pending" && "text-yellow-400",
            status === "failed" && "text-red-500",
        )

        switch (type) {
            case "sent":
                return <ArrowUp className={iconClass} />
            case "received":
                return <ArrowDown className={iconClass} />
            case "swap":
                return <ArrowUpDown className={iconClass} />
            default:
                return <ArrowUp className={iconClass} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-400"
            case "pending":
                return "text-yellow-400"
            case "failed":
                return "text-red-400"
            default:
                return "text-muted-foreground"
        }
    }


    return (
        <div className="p-4 space-y-6 max-w-6xl mx-auto">
            {/* Header and Search/Filter UI remain the same */}
            {/* ... (Header) */}
            <div className="flex items-center gap-4 pt-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold animate-in slide-in-from-left duration-300">Transaction History</h1>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                 {[
                    { label: "All", value: "all" },
                    { label: "Sent", value: "sent" },
                    { label: "Received", value: "received" },
                 ].map((option) => (
                    <Button
                        key={option.value}
                        onClick={() => setActiveFilter(option.value)}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "flex-1 relative transition-all duration-200",
                            activeFilter === option.value && "bg-background text-foreground shadow-sm",
                        )}
                    >
                        {option.label}
                        {activeFilter === option.value && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 gradient-purple-blue rounded-full" />
                        )}
                    </Button>
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTransactions.length === 0 ? (
                    <Card className="p-8 text-center md:col-span-2">
                        <p className="text-muted-foreground">No transactions found matching your filter or search.</p>
                    </Card>
                ) : (
                    filteredTransactions.map((transaction, index) => (
                        <Card
                            key={transaction.id}
                            className="p-4 hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in slide-in-from-left"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <a 
                                href={getExplorerLink(transaction.hash, transaction.chain)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center glow-purple">
                                        {getTransactionIcon(transaction.type, transaction.status)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold capitalize">
                                                {transaction.type === "swap"
                                                    ? `Swap ${transaction.asset} → ${transaction.toAsset}`
                                                    : `${transaction.type} ${transaction.asset}`}
                                            </p>
                                            <span className={cn("text-xs capitalize", getStatusColor(transaction.status))}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                        {/* Display only the first 6 and last 4 chars of the address for cleaner UI */}
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.type === "sent" ? "To:" : "From:"} {transaction.address.slice(0, 6)}...{transaction.address.slice(-4)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.date} • {transaction.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={cn(
                                            "font-semibold",
                                            transaction.type === "sent" && "text-red-400",
                                            transaction.type === "received" && "text-green-400",
                                        )}
                                    >
                                        {transaction.type === "sent" && "-"}
                                        {transaction.type === "received" && "+"}
                                        {formatWeiValue(transaction.amount, transaction.chain)}
                                    </p>
                                    {/* Placeholder for USD Value */}
                                    <p className="text-sm text-muted-foreground">${transaction.value.toFixed(2)}</p> 
                                </div>
                            </a>
                        </Card>
                    ))
                )}
            </div>

            {/* Load More - Can be updated later to fetch the next page of Moralis data */}
            {filteredTransactions.length > 0 && (
                <Button variant="outline" className="w-full bg-transparent">
                    Load More Transactions
                </Button>
            )}
            <BottomNavigation />
        </div>
    )
}

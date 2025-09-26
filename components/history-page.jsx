"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowLeft, ArrowUp, ArrowDown, ArrowUpDown, ExternalLink, Search } from "lucide-react"
import { Input } from "../components/ui/input"
import Link from "next/link"
import { cn } from "../lib/utils"

// type TransactionType = "sent" | "received" | "swap"



const transactions = [
  {
    id: "1",
    type: "received",
    asset: "ETH",
    amount: "0.5",
    value: 1945.38,
    address: "0x742d...8f3a",
    date: "Today",
    time: "2:30 PM",
    status: "completed",
    hash: "0x8f3a742d...",
  },
  {
    id: "2",
    type: "sent",
    asset: "USDC",
    amount: "250.00",
    value: 250.0,
    address: "0x1a2b...9c8d",
    date: "Today",
    time: "11:15 AM",
    status: "completed",
    hash: "0x9c8d1a2b...",
  },
  {
    id: "3",
    type: "swap",
    asset: "BTC",
    amount: "0.001",
    value: 98.42,
    toAsset: "SOL",
    toAmount: "0.4",
    address: "Uniswap V3",
    date: "Yesterday",
    time: "4:45 PM",
    status: "completed",
    hash: "0x4f5e6d7c...",
  },
  {
    id: "4",
    type: "sent",
    asset: "ETH",
    amount: "0.1",
    value: 389.08,
    address: "0x9f8e...2d1c",
    date: "Yesterday",
    time: "9:20 AM",
    status: "pending",
    hash: "0x2d1c9f8e...",
  },
  {
    id: "5",
    type: "received",
    asset: "SOL",
    amount: "5.0",
    value: 1226.5,
    address: "0x3c4d...7e8f",
    date: "2 days ago",
    time: "6:10 PM",
    status: "completed",
    hash: "0x7e8f3c4d...",
  },
  {
    id: "6",
    type: "swap",
    asset: "USDC",
    amount: "500.00",
    value: 500.0,
    toAsset: "ETH",
    toAmount: "0.128",
    address: "1inch",
    date: "3 days ago",
    time: "1:25 PM",
    status: "failed",
    hash: "0x5a6b7c8d...",
  },
]

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Sent", value: "sent" },
  { label: "Received", value: "received" },
  { label: "Swapped", value: "swap" },
]

export function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = activeFilter === "all" || tx.type === activeFilter
    const matchesSearch =
      searchQuery === "" ||
      tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
      {/* Header */}
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
        {filterOptions.map((option) => (
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
            <p className="text-muted-foreground">No transactions found</p>
          </Card>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <Card
              key={transaction.id}
              className="p-4 hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in slide-in-from-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
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
                    <p className="text-sm text-muted-foreground">{transaction.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      transaction.type === "sent" && transaction.status === "completed" && "text-red-400",
                      transaction.type === "received" && transaction.status === "completed" && "text-green-400",
                      transaction.type === "swap" && "text-foreground",
                      transaction.status === "pending" && "text-yellow-400",
                      transaction.status === "failed" && "text-red-400",
                    )}
                  >
                    {transaction.type === "sent" && "-"}
                    {transaction.type === "received" && "+"}
                    {transaction.amount} {transaction.asset}
                  </p>
                  {transaction.type === "swap" && transaction.toAmount && (
                    <p className="text-sm text-green-400">
                      +{transaction.toAmount} {transaction.toAsset}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">${transaction.value.toLocaleString()}</p>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Hash: {transaction.hash}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <Button variant="outline" className="w-full bg-transparent">
          Load More Transactions
        </Button>
      )}
    </div>
  )
}

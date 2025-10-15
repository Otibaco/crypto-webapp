"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, ArrowUpDown, Settings, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "../lib/utils"
import { BottomNavigation } from "./bottom-navigation"

// 🚨 CRITICAL: YOU MUST CONFIGURE YOUR BACKEND ROUTES!
// You need to set up a secure proxy/API route to handle 1inch calls
// and hide your API key from the client side.
// The routes below are placeholders for your Next.js API routes (e.g., pages/api/1inch-quote.js).

// ⚠️ PLACEHOLDER: Replace with your actual Reown AppKit wallet hook
const useWallet = () => {
    // In a real app, this would get the wallet connection status and address
    const isConnected = true; // For demonstration, assume connected
    const address = "0xYourConnectedWalletAddressGoesHere";
    // NOTE: In a real app, 'currentChain' would be the wallet's currently selected network.
    const currentChain = { id: 1, name: "Ethereum" }; // 1: Ethereum
    const sendTransaction = (tx) => {
        console.log("Simulating sendTransaction:", tx);
        // In a real application, you would use your wallet provider (e.g., wagmi, web3modal)
        // to sign and send the transaction object (tx).
        alert("Transaction simulated! Check console for details. Implement actual wallet signing here.");
        return Promise.resolve({ hash: '0xmockhash123' });
    };
    return { isConnected, address, currentChain, sendTransaction };
};

/**
 * 💡 PROFESSIONAL INTEGRATION POINT: Balances Hook
 *
 * YOU MUST IMPLEMENT A SECURE WAY to fetch real token balances.
 * The returned object should map: "chainId:tokenAddress" -> "balanceAsAString"
 */
const useBalances = (address) => {
    const [balances, setBalances] = useState({});
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);

    useEffect(() => {
        if (!address) {
            setBalances({});
            return;
        }

        const fetchAllBalances = async () => {
            setIsLoadingBalances(true);
            try {
                // 🛑 PROFESSIONAL STEP: Replace this with your actual secure API call!
                // Example: const response = await fetch(`/api/user-balances?address=${address}`);
                // const liveBalances = await response.json();
                
                // 🚀 TEMPORARY MOCK DATA for local testing. REMOVE after implementing LIVE FETCH.
                const liveBalances = {
                    "1:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "1.2456", // ETH on Ethereum
                    "1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "1250.00", // USDC on Ethereum
                    "42161:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "5.0000", // ARB on Arbitrum
                    "10:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "10.0000", // OP on Optimism
                    "137:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "50.0000", // MATIC on Polygon
                };
                // 🚀 END OF TEMPORARY MOCK DATA

                setBalances(liveBalances);

            } catch (error) {
                console.error("Failed to fetch live balances:", error);
                setBalances({});
            } finally {
                setIsLoadingBalances(false);
            }
        };

        // This ensures balances are fetched when the component loads or address changes
        fetchAllBalances();
    }, [address]); 

    return { balances, isLoadingBalances };
};


// 1inch API uses chain IDs for networks
// The 'logo' is a placeholder character, replace with actual icons/images/URLs
const ASSETS_BY_NETWORK = {
    "1": { // Ethereum Chain ID
        name: "Ethereum",
        assets: [
            { symbol: "ETH", name: "Ethereum", logo: "Ξ", color: "text-blue-400", isNative: true, decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
            { symbol: "USDT", name: "Tether USD", logo: "$", color: "text-green-500", decimals: 6, address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
            { symbol: "USDC", name: "USD Coin", logo: "$", color: "text-blue-500", decimals: 6, address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
        ]
    },
    "10": { // Optimism Chain ID
        name: "Optimism",
        assets: [
            { symbol: "OP", name: "Optimism", logo: "🔴", color: "text-red-500", isNative: true, decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
            { symbol: "USDC", name: "USD Coin (OP)", logo: "$", color: "text-blue-500", decimals: 6, address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607" },
        ]
    },
    "56": { // BNB Chain ID
        name: "BNB Chain",
        assets: [
            { symbol: "BNB", name: "BNB", logo: "B", color: "text-yellow-500", isNative: true, decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
            { symbol: "USDT", name: "Tether USD (BSC)", logo: "$", color: "text-green-500", decimals: 18, address: "0x55d398326f99059ff775485246cd36e2d77ef183" },
        ]
    },
    "137": { // Polygon Chain ID
        name: "Polygon",
        assets: [
            { symbol: "MATIC", name: "Polygon", logo: "P", color: "text-purple-500", isNative: true, decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
            { symbol: "USDC", name: "USD Coin (Poly)", logo: "$", color: "text-blue-500", decimals: 6, address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" },
        ]
    },
    "42161": { // Arbitrum Chain ID
        name: "Arbitrum",
        assets: [
            { symbol: "ARB", name: "Arbitrum", logo: "A", color: "text-sky-400", isNative: true, decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
            { symbol: "USDC", name: "USD Coin (Arbi)", logo: "$", color: "text-blue-500", decimals: 6, address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831" },
        ]
    },
};

// Utility to get the full asset data, including the live balance
const getAssetData = (assetKey, balances) => {
    const [chainId, symbol] = assetKey.split(":");
    const network = ASSETS_BY_NETWORK[chainId];
    const asset = network?.assets.find(a => a.symbol === symbol);
    if (!asset) return null;

    // Get the live balance from the fetched data
    const balanceKey = `${chainId}:${asset.address}`;
    const balance = balances[balanceKey] || "0";

    return { 
        ...asset, 
        chainId, 
        networkName: network.name, 
        balance 
    };
};

// Utility for formatting amount to smallest unit (e.g., wei)
const getAmountInWei = (amount, decimals = 18) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return "0";
    try {
        // Use BigInt for precision
        const multiplier = BigInt(10) ** BigInt(decimals);
        const [integer, fraction] = amount.toString().split('.');
        
        let wei = BigInt(integer) * multiplier;

        if (fraction) {
            const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
            wei += BigInt(paddedFraction);
        }

        return wei.toString();
    } catch (e) {
        console.error("Error converting to wei:", e);
        return "0";
    }
};

// Utility to convert from smallest unit to readable amount
const fromWei = (amount, decimals = 18) => {
    if (!amount) return 0;
    try {
        const bigAmount = BigInt(amount);
        const divisor = BigInt(10) ** BigInt(decimals);
        // Divide and convert to a number for display (losing some precision is acceptable for UI)
        return Number(bigAmount) / Number(divisor);
    } catch (e) {
        console.error("Error converting from wei:", e);
        return 0;
    }
};

export function SwapPage() {
    const { isConnected, address, currentChain, sendTransaction } = useWallet();
    const { balances, isLoadingBalances } = useBalances(address);

    const [fromAssetKey, setFromAssetKey] = useState("1:ETH");
    const [toAssetKey, setToAssetKey] = useState("1:USDC");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [quoteData, setQuoteData] = useState(null);
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [quoteError, setQuoteError] = useState(null);
    const [isSwapExecuting, setIsSwapExecuting] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false); // Added missing state for UI animation

    // Use Memo to ensure asset data is only recalculated when keys or balances change
    const fromAssetData = useMemo(() => getAssetData(fromAssetKey, balances), [fromAssetKey, balances]);
    const toAssetData = useMemo(() => getAssetData(toAssetKey, balances), [toAssetKey, balances]);

    const allChains = useMemo(() => Object.keys(ASSETS_BY_NETWORK), []);

    const fromChainId = fromAssetData?.chainId;
    const toChainId = toAssetData?.chainId;
    const isSameChain = fromChainId === toChainId;

    // --- Core Logic: Fetch 1inch Quote (Debounced) ---
    useEffect(() => {
        setQuoteData(null);
        setQuoteError(null);
        setToAmount("");

        // 1. Check for basic input validity
        if (!fromAmount || Number(fromAmount) <= 0 || !fromAssetData || !toAssetData) {
            return;
        }

        // 2. Check for cross-chain issues
        if (!isSameChain) {
            setQuoteError("Cross-chain swaps are not supported in this version. Select assets on the same network.");
            return;
        }

        const fetchQuote = async () => {
            setIsLoadingQuote(true);
            
            try {
                const amountInWei = getAmountInWei(fromAmount, fromAssetData.decimals);

                // 🛑 INTEGRATION: Call your secure backend route
                const quoteResponse = await fetch(`/api/1inch-quote?fromTokenAddress=${fromAssetData.address}&toTokenAddress=${toAssetData.address}&amount=${amountInWei}&chainId=${fromChainId}`);

                const data = await quoteResponse.json();

                if (!quoteResponse.ok) {
                    throw new Error(data.details?.description || data.message || "Failed to fetch quote from 1inch.");
                }

                setQuoteData(data);
                
                // Convert the received amount (in smallest unit) back to a readable number
                const receivedAmount = fromWei(data.toTokenAmount, toAssetData.decimals);
                setToAmount(receivedAmount.toFixed(6)); // Format for display
                setQuoteError(null);

            } catch (error) {
                console.error("1inch Quote Fetch Error:", error);
                setQuoteError(error.message || "Could not get a swap quote.");
                setToAmount("0.0");
            } finally {
                setIsLoadingQuote(false);
            }
        };

        const timeoutId = setTimeout(fetchQuote, 500); // Debounce quote request (500ms delay)
        return () => clearTimeout(timeoutId);

    }, [fromAmount, fromAssetData, toAssetData, fromChainId, isSameChain]);

    // --- UI/UX: Handle Asset Swapping ---
    const handleSwapAssets = useCallback(() => {
        if (fromAssetKey === toAssetKey) return; 
        
        // Add a slight delay to allow the animation to show
        setIsSwapping(true);
        setTimeout(() => {
            setFromAssetKey(toAssetKey);
            setToAssetKey(fromAssetKey);
            // Optionally, swap the input amounts as well (UX preference)
            setFromAmount(toAmount); 
            setIsSwapping(false);
        }, 300);
    }, [fromAssetKey, toAssetKey, toAmount]);

    // --- Core Logic: Execute Swap ---
    const handleSwap = async () => {
        const inputAmountNumber = Number(fromAmount);
        const userBalanceNumber = Number(fromAssetData.balance);

        if (!inputAmountNumber || !toAmount || quoteError || !quoteData || !address || isSwapExecuting) return;

        // Final balance check before transaction
        if (inputAmountNumber > userBalanceNumber) {
            alert(`Transaction Aborted: Insufficient ${fromAssetData.symbol} balance.`);
            return;
        }

        // Final chain check (User's wallet must be on the swap chain)
        if (currentChain.id.toString() !== fromChainId) {
             alert(`Transaction Aborted: Please switch your wallet network to ${fromAssetData.networkName} (${fromChainId}) to proceed.`);
             return;
        }


        setIsSwapExecuting(true);

        try {
            // 1. **REQUIRED PROFESSIONAL STEP: CHECK ERC-20 APPROVAL**
            // For non-native tokens (not '0xeeee...'), you MUST:
            // a) Call the 1inch 'allowance' endpoint (via backend) to check the spender's allowance.
            // b) If allowance is too low, call the 1inch 'approve' endpoint (via backend) to get the TX data.
            // c) Ask the user to sign the APPROVE transaction using `sendTransaction(approvalTx)`.
            // d) Wait for the approval transaction to confirm before proceeding to the swap!
            if (!fromAssetData.isNative) {
                // Skipping implementation, but this is critical!
                console.warn("⚠️ ERC-20 Approval Check Skipped. Must be implemented in production.");
            }


            // 2. **GET SWAP TRANSACTION DATA:** Call your backend route
            // We use the exact amount from the quote to prevent slippage issues from recalculation
            const swapResponse = await fetch(`/api/1inch-swap?fromTokenAddress=${fromAssetData.address}&toTokenAddress=${toAssetData.address}&amount=${quoteData.fromTokenAmount}&fromAddress=${address}&chainId=${fromChainId}&slippage=1`); // 1% slippage default

            const swapData = await swapResponse.json();

            if (!swapResponse.ok || !swapData.tx) {
                throw new Error(swapData.details?.description || swapData.message || "Failed to get swap transaction data.");
            }

            // 3. **SEND TRANSACTION:** Use the wallet provider to sign and send the transaction
            alert(`Please confirm the swap of ${fromAmount} ${fromAssetData.symbol} in your wallet.`);
            const txHash = await sendTransaction(swapData.tx);

            console.log(`Swap successful! Transaction Hash: ${txHash.hash}`);
            alert(`Swap executed successfully! Transaction Hash: ${txHash.hash}`);

            // Clear inputs and trigger balance refresh (by fetching new balances on success)
            setFromAmount("");
            setToAmount("");
            // In a real app, you would manually trigger a refresh of the 'useBalances' hook here.

        } catch (error) {
            console.error("Swap execution error:", error);
            // Check for common wallet errors (e.g., user rejected transaction)
            const errorMessage = error.message.includes("rejected") ? "Transaction rejected by user." : error.message;
            alert(`Swap failed: ${errorMessage}`);
        } finally {
            setIsSwapExecuting(false);
        }
    };
    
    // --- UI Helpers ---
    const isInsufficientBalance = fromAssetData && Number(fromAmount) > Number(fromAssetData.balance);
    const isSwapDisabled = !fromAmount || !toAmount || isLoadingQuote || !!quoteError || isSwapExecuting || isInsufficientBalance || !isSameChain;
    const canSwap = isConnected && !isSwapDisabled;
    
    // Calculate the human-readable exchange rate
    const exchangeRate = quoteData 
        ? fromWei(quoteData.toTokenAmount, toAssetData.decimals) / fromWei(quoteData.fromTokenAmount, fromAssetData.decimals) 
        : 0;

    // Estimate Gas Fee (assuming gas is always in the native chain currency, e.g., ETH/BNB/MATIC)
    const gasFeeNative = quoteData?.estimatedGas 
        ? `${fromWei(quoteData.estimatedGas, 18).toFixed(6)} ${fromAssetData.networkName}` 
        : "Estimating...";

    // Determine the button text based on state
    const getSwapButtonText = () => {
        if (!isConnected) return "Connect Wallet";
        if (isSwapExecuting) return <><Loader2 className="h-5 w-5 animate-spin" /> Executing Swap...</>;
        if (isLoadingQuote) return "Fetching Best Price...";
        if (quoteError) return "Cannot Swap (See Error)";
        if (isInsufficientBalance) return `Insufficient ${fromAssetData.symbol} Balance`;
        if (fromChainId !== currentChain.id.toString()) return `Switch to ${currentChain.name}`; // Action to switch chain
        if (isSwapDisabled) return "Enter Valid Amount";
        return `Swap ${fromAssetData?.symbol || 'Asset'} for ${toAssetData?.symbol || 'Asset'}`;
    }

    // --- Component Render ---
    if (!isConnected) {
        return (
            <div className="p-4 space-y-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
                <h1 className="text-2xl font-bold">Swap</h1>
                <Card className="p-8 text-center space-y-4">
                    <p className="text-lg font-medium">Wallet Not Connected</p>
                    <p className="text-muted-foreground">Please connect your wallet to view and use the swap interface.</p>
                    <Button className="gradient-green-cyan">Connect Wallet (Reown AppKit)</Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold animate-in slide-in-from-left duration-300">Swap</h1>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>

            {/* Current Network Indicator */}
            <div className="text-sm text-center text-muted-foreground">
                Current Wallet Network: <span className="font-semibold text-primary">{currentChain.name} ({currentChain.id})</span>
            </div>
            
            {/* Swap Interface */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                
                {/* You Pay Card */}
                <Card className="p-4 space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">You Pay</span>
                        {fromAssetData && (
                            <span className={cn("text-xs flex items-center gap-1", isInsufficientBalance ? "text-red-500 font-bold" : "text-muted-foreground")}>
                                Balance: {isLoadingBalances ? <Loader2 className="h-3 w-3 animate-spin" /> : Number(fromAssetData.balance).toLocaleString('en-US', { maximumFractionDigits: 4 })} {fromAssetData.symbol}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Select value={fromAssetKey} onValueChange={setFromAssetKey}>
                            <SelectTrigger className="w-40">
                                <SelectValue>
                                    {fromAssetData ? (
                                        <AssetDisplay asset={fromAssetData} />
                                    ) : "Select Asset"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {allChains.map((chainId) => (
                                    <div key={chainId}>
                                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                            {ASSETS_BY_NETWORK[chainId].name}
                                        </div>
                                        {ASSETS_BY_NETWORK[chainId].assets.map((asset) => (
                                            <SelectItem key={`${chainId}:${asset.symbol}`} value={`${chainId}:${asset.symbol}`}>
                                                <AssetDisplay asset={{ ...asset, chainId }} />
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="0.0"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="flex-1 text-right text-xl font-bold border-none bg-transparent focus:ring-0"
                            min="0"
                        />
                    </div>

                    {fromAssetData && (
                        <div className="flex justify-between items-center text-sm text-muted-foreground animate-in fade-in duration-300">
                            <span>On: {fromAssetData.networkName}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-primary"
                                onClick={() => setFromAmount(fromAssetData.balance)}
                                disabled={isLoadingBalances || Number(fromAssetData.balance) <= 0}
                            >
                                Max
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Swap Button */}
                <div className="flex justify-center lg:px-4">
                    <Button
                        onClick={handleSwapAssets}
                        size="icon"
                        className={cn(
                            "rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300",
                            isSwapping && "rotate-180 transition-transform duration-300",
                        )}
                        disabled={isSwapping}
                    >
                        <ArrowUpDown className="h-5 w-5" />
                    </Button>
                </div>

                {/* You Receive Card */}
                <Card className="p-4 space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">You Receive (Est.)</span>
                        {toAssetData && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                Balance: {isLoadingBalances ? <Loader2 className="h-3 w-3 animate-spin" /> : Number(toAssetData.balance).toLocaleString('en-US', { maximumFractionDigits: 4 })} {toAssetData.symbol}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Select value={toAssetKey} onValueChange={setToAssetKey}>
                            <SelectTrigger className="w-40">
                                <SelectValue>
                                    {toAssetData ? (
                                        <AssetDisplay asset={toAssetData} />
                                    ) : "Select Asset"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {allChains.map((chainId) => (
                                    <div key={chainId}>
                                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                            {ASSETS_BY_NETWORK[chainId].name}
                                        </div>
                                        {ASSETS_BY_NETWORK[chainId].assets.map((asset) => (
                                            <SelectItem key={`${chainId}:${asset.symbol}`} value={`${chainId}:${asset.symbol}`}>
                                                <AssetDisplay asset={{ ...asset, chainId }} />
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex-1 text-right">
                            <p className="text-xl font-bold">
                                {isLoadingQuote ? <Loader2 className="h-5 w-5 animate-spin float-right" /> : (toAmount ? Number(toAmount).toFixed(6) : "0.0")}
                            </p>
                        </div>
                    </div>

                    {toAssetData && (
                        <p className="text-right text-sm text-muted-foreground animate-in fade-in duration-300">
                            On: {toAssetData.networkName}
                        </p>
                    )}
                </Card>
            </div>

            {/* Quote Error Message */}
            {quoteError && (
                <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 rounded-lg animate-in fade-in">
                    ⚠️ {quoteError}
                </div>
            )}

            {/* Exchange Rate & Fees */}
            {exchangeRate > 0 && !isLoadingQuote && !quoteError && isSameChain && (
                <Card className="p-4 space-y-3 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Exchange Rate</span>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">
                            1 {fromAssetData.symbol} = {exchangeRate.toFixed(6)} {toAssetData.symbol}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Network Fee (Est.)</span>
                        <div className="text-right">
                            <p className="text-sm font-medium">{gasFeeNative}</p>
                            <p className="text-xs text-muted-foreground">≈ USD Estimate N/A</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Minimum Received</span>
                        <span className="text-sm font-medium text-amber-500">
                            {quoteData?.toTokenAmount // Calculate min received based on a 1% slippage (default)
                                ? fromWei(BigInt(quoteData.toTokenAmount) * BigInt(99) / BigInt(100), toAssetData.decimals).toFixed(6)
                                : "N/A"
                            } {toAssetData.symbol}
                        </span>
                    </div>
                </Card>
            )}

            {/* Final Swap Button */}
            <Button
                onClick={handleSwap}
                disabled={isSwapDisabled}
                className={cn(
                    "w-full h-14 text-lg font-semibold gradient-green-cyan hover:opacity-90 transition-all duration-200 active:scale-95",
                    (!canSwap && isConnected) && "bg-gray-500 hover:bg-gray-500/90 text-gray-200 cursor-not-allowed" // Better visual for disabled state
                )}
            >
                {getSwapButtonText()}
            </Button>

            {/* Recent Swaps */}
            <Card className="p-4">
                <h3 className="font-semibold mb-3">Recent Swaps</h3>
                <div className="space-y-3">
                    {[
                        { from: "ETH", to: "USDC", amount: "0.5", time: "2 hours ago", fromColor: "text-blue-400", toColor: "text-green-400", fromLogo: "Ξ", toLogo: "$" },
                        { from: "ARB", to: "OP", amount: "10.0", time: "1 day ago", fromColor: "text-sky-400", toColor: "text-red-500", fromLogo: "A", toLogo: "🔴" },
                    ].map((swap, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    <div className={cn("w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold", swap.fromColor)}>
                                        {swap.fromLogo}
                                    </div>
                                    <ArrowUpDown className="h-3 w-3 mx-1 text-muted-foreground" />
                                    <div className={cn("w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold", swap.toColor)}>
                                        {swap.toLogo}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {swap.amount} {swap.from} → {swap.to}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{swap.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <BottomNavigation />
        </div>
    );
}

// Reusable Asset Display Component
const AssetDisplay = ({ asset }) => (
    <div className="flex items-center gap-2">
        <div
            className={cn(
                "w-6 h-6 rounded-full bg-secondary flex items-center justify-center",
                asset.color
            )}
        >
            <span className="text-xs font-bold">{asset.logo}</span>
        </div>
        <span className="font-medium">{asset.symbol}</span>
        <span className="text-xs text-muted-foreground opacity-70">({ASSETS_BY_NETWORK[asset.chainId].name})</span>
    </div>
);
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, ArrowUpDown, Settings, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "../lib/utils"

// ==============================================================================
// 🛑 PROFESSIONAL INTEGRATION: REOWN APP KIT IMPORTS
// 
// ⚠️ CRITICAL: Replace these placeholder hooks with the actual Reown SDK imports!
// These function names are based on standard wallet/transaction SDKs (like Wagmi/AppKit).
// ==============================================================================

// PLACEHOLDER: Use the actual Reown hook for wallet connection and chain info.
const useAppKitAccount = () => {
    // ⚠️ CRITICAL UPDATE: Set isConnected to false by default for the initial state.
    const isConnected = false; // Mock: Assume user is NOT connected initially
    const address = "0xYourConnectedWalletAddressGoesHere"; // Mock: User's connected address
    const currentChain = { id: 1, name: "Ethereum" }; // Mock: Wallet's current network
    return { isConnected, address, currentChain };
};

// PLACEHOLDER: Use the actual Reown hook for swap functionality.
const useAppKitSwap = () => {
    // NOTE: In a real Reown AppKit integration, these functions would be provided
    // by the SDK and handle the quoting, approval (if needed), and transaction signing.
    
    // MOCK: Simulates fetching a quote from Reown's internal 1inch integration
    const getQuote = async ({ fromTokenAddress, toTokenAddress, amount, chainId }) => {
        console.log("Reown Swap: Fetching quote via AppKit...");
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

        if (chainId !== '1') { // Mock error for non-Ethereum chain
            throw new Error("Reown Swap Error: Only mainnet swaps are supported in this demo.");
        }

        // Mock Quote Data Structure (Simplified from real quote/transaction data)
        // Ensure amount is processed as BigInt for high precision for toTokenAmount calculation
        const inputAmount = BigInt(amount);
        const toAmount = (inputAmount * BigInt(99) / BigInt(100)).toString(); // 1% loss mock

        return {
            toTokenAmount: toAmount, 
            estimatedGas: "500000000000000", // Mock gas in wei
            estimatedSlippage: "1", // Mock slippage
        };
    };

    // MOCK: Simulates executing a swap using Reown's internal transaction handler
    const executeSwap = async ({ fromTokenAddress, toTokenAddress, amount, address, chainId }) => {
        console.log("Reown Swap: Executing swap via AppKit...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate execution delay

        if (address === "0xYourConnectedWalletAddressGoesHere") {
             // Mock success
            return { hash: `0xreownhash${Math.random().toString(16).slice(2)}` };
        } else {
            throw new Error("Wallet rejected transaction or failed to execute.");
        }
    };
    
    return { getQuote, executeSwap };
};


/**
 * 💡 PROFESSIONAL INTEGRATION POINT: Balances Hook
 *
 * YOU MUST IMPLEMENT A SECURE WAY to fetch real token balances.
 * This should use a secure API (like Reown's own Cloud API, Alchemy, or Etherscan).
 * The returned object should map: "chainId:tokenAddress" -> "balanceAsAString"
 */
const useBalances = (address) => {
    const [balances, setBalances] = useState({});
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);

    useEffect(() => {
        if (!address || address === "0xYourConnectedWalletAddressGoesHere") { // Skip mock address
            setBalances({});
            return;
        }

        const fetchAllBalances = async () => {
            setIsLoadingBalances(true);
            try {
                // 🛑 PROFESSIONAL STEP: Replace this with your actual secure API call!
                
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


// Asset Definitions remain the same
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

// Utility functions (getAssetData, getAmountInWei, fromWei) remain the same

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

const getAmountInWei = (amount, decimals = 18) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return "0";
    try {
        const multiplier = BigInt(10) ** BigInt(decimals);
        const [integer, fraction] = amount.toString().split('.');
        
        let wei = BigInt(integer) * multiplier;

        if (fraction) {
            const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
            wei += BigInt(paddedFraction);
        }

        return wei.toString();
    } catch (e) {
        // console.error("Error converting to wei:", e);
        return "0";
    }
};

const fromWei = (amount, decimals = 18) => {
    if (!amount) return 0;
    try {
        const bigAmount = BigInt(amount);
        const divisor = BigInt(10) ** BigInt(decimals);
        // Divide and convert to a number for display (losing some precision is acceptable for UI)
        return Number(bigAmount) / Number(divisor);
    } catch (e) {
        // console.error("Error converting from wei:", e);
        return 0;
    }
};


export function SwapPage() {
    // 🚀 STEP 1: Use Reown AppKit Hooks
    // 🛑 isConnected will be FALSE by default, triggering the 'Disconnected' UI
    const { isConnected, address, currentChain } = useAppKitAccount(); 
    const { getQuote, executeSwap } = useAppKitSwap();
    // Balances will be empty when not connected, which is fine
    const { balances, isLoadingBalances } = useBalances(address); 

    const [fromAssetKey, setFromAssetKey] = useState("1:ETH");
    const [toAssetKey, setToAssetKey] = useState("1:USDC");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [quoteResult, setQuoteResult] = useState(null); 
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [quoteError, setQuoteError] = useState(null);
    const [isSwapExecuting, setIsSwapExecuting] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false); 

    // Use Memo to ensure asset data is only recalculated when keys or balances change
    const fromAssetData = useMemo(() => getAssetData(fromAssetKey, balances), [fromAssetKey, balances]);
    const toAssetData = useMemo(() => getAssetData(toAssetKey, balances), [toAssetKey, balances]);

    const allChains = useMemo(() => Object.keys(ASSETS_BY_NETWORK), []);

    const fromChainId = fromAssetData?.chainId;
    const toChainId = toAssetData?.chainId;
    const isSameChain = fromChainId === toChainId;

    // --- Core Logic: Fetch Reown Quote (Debounced) ---
    useEffect(() => {
        // Only run if connected and assets are selected
        if (!isConnected || !fromAssetData || !toAssetData) {
            setQuoteResult(null);
            setQuoteError(null);
            setToAmount("");
            return;
        }

        setQuoteResult(null);
        setQuoteError(null);
        setToAmount("");

        // 1. Check for basic input validity
        if (!fromAmount || Number(fromAmount) <= 0) {
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
                // Convert human-readable amount to the smallest unit (wei)
                const amountInWei = getAmountInWei(fromAmount, fromAssetData.decimals);

                // 🚀 STEP 2: Call Reown's built-in quote function
                const quote = await getQuote({ 
                    fromTokenAddress: fromAssetData.address, 
                    toTokenAddress: toAssetData.address, 
                    amount: amountInWei, 
                    chainId: fromChainId 
                });

                setQuoteResult(quote);
                
                // Convert the received amount (in smallest unit) back to a readable number
                const receivedAmount = fromWei(quote.toTokenAmount, toAssetData.decimals);
                setToAmount(receivedAmount.toFixed(6)); // Format for display
                setQuoteError(null);

            } catch (error) {
                console.error("Reown Quote Fetch Error:", error);
                setQuoteError(error.message || "Could not get a swap quote.");
                setToAmount("0.0");
            } finally {
                setIsLoadingQuote(false);
            }
        };

        const timeoutId = setTimeout(fetchQuote, 500); // Debounce quote request (500ms delay)
        return () => clearTimeout(timeoutId);

    }, [fromAmount, fromAssetData, toAssetData, fromChainId, isSameChain, getQuote, isConnected]); // Added isConnected dependency

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

        if (!inputAmountNumber || !toAmount || quoteError || !quoteResult || !address || isSwapExecuting) return;

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
            // 🚀 STEP 3: Execute Swap using Reown's function
            
            alert(`Please confirm the swap of ${fromAmount} ${fromAssetData.symbol} in your wallet.`);
            
            const txHash = await executeSwap({
                fromTokenAddress: fromAssetData.address,
                toTokenAddress: toAssetData.address,
                // Use the exact amount from the quote to prevent slippage issues from recalculation
                amount: getAmountInWei(fromAmount, fromAssetData.decimals), 
                address: address, // The wallet address executing the swap
                chainId: fromChainId,
                slippage: 1 // Example slippage parameter (Reown's function handles this internally)
            });

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
    const isInsufficientBalance = isConnected && fromAssetData && Number(fromAmount) > Number(fromAssetData.balance);
    const isSwapDisabled = !fromAmount || !toAmount || isLoadingQuote || !!quoteError || isSwapExecuting || isInsufficientBalance || !isSameChain;
    const canSwap = isConnected && !isSwapDisabled;
    
    // Calculate the human-readable exchange rate
    const exchangeRate = quoteResult 
        // Need to use BigInt math for precision before dividing, but for UI approximation, we use Number conversion
        ? Number(fromWei(quoteResult.toTokenAmount, toAssetData.decimals)) / Number(fromWei(getAmountInWei(fromAmount, fromAssetData.decimals), fromAssetData.decimals))
        : 0;

    // Estimate Gas Fee (assuming gas is always in the native chain currency, e.g., ETH/BNB/MATIC)
    const gasFeeNative = quoteResult?.estimatedGas 
        ? `${fromWei(quoteResult.estimatedGas, 18).toFixed(6)} ${fromAssetData.networkName}` 
        : "Estimating...";

    // Determine the button text based on state
    const getSwapButtonText = () => {
        // 🛑 This is the main check now
        if (!isConnected) return "Connect Wallet (Reown AppKit)"; 
        
        if (isSwapExecuting) return <><Loader2 className="h-5 w-5 animate-spin" /> Executing Swap...</>;
        if (isLoadingQuote) return "Fetching Best Price...";
        if (quoteError) return "Cannot Swap (See Error)";
        if (isInsufficientBalance) return `Insufficient ${fromAssetData.symbol} Balance`;
        if (fromChainId !== currentChain.id.toString()) return `Switch Wallet to ${fromAssetData?.networkName || 'Network'}`; 
        if (isSwapDisabled) return "Enter Valid Amount";
        return `Swap ${fromAssetData?.symbol || 'Asset'} for ${toAssetData?.symbol || 'Asset'}`;
    }

    // --- Component Render: Disconnected View ---
    // If the user is NOT connected, show the minimal UI first
    if (!isConnected) {
        return (
            <div className="p-4 space-y-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
                <h1 className="text-2xl font-bold">Swap</h1>
                <Card className="p-8 text-center space-y-4 shadow-lg">
                    <p className="text-lg font-medium">Wallet Disconnected</p>
                    <p className="text-muted-foreground">Please connect your wallet to use the send feature.</p>
                    {/* 🛑 INTEGRATION: This button should trigger your Reown AppKit Modal */}
                    <Button className="gradient-green-cyan w-full mt-4">Connect Wallet (Reown AppKit)</Button> 
                </Card>
                <BottomNavigation />
            </div>
        )
    }

    // --- Component Render: Connected Swap Page UI ---
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
                        <span className="text-sm text-muted-foreground">Minimum Received (1% Slippage)</span>
                        <span className="text-sm font-medium text-amber-500">
                            {quoteResult?.toTokenAmount // Calculate min received based on a 1% slippage (default)
                                ? fromWei(BigInt(quoteResult.toTokenAmount) * BigInt(99) / BigInt(100), toAssetData.decimals).toFixed(6)
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
"use client"

import React, { useState, useMemo } from "react"
// Shadcn/UI Components (mocked or imported from assumed project structure)
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog" 
import { ArrowLeft, Scan, User, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "../lib/utils" // Utility for conditional class names
import { truncateAddress } from '../lib/utils' // Utility for shortening addresses (assumed)


// WAGMI/VIEM IMPORTS
// import { useAccount, useBalance, useSendTransaction, usePrepareSendTransaction, usePrepareWriteContract, useWriteContract, useWaitForTransaction } from 'wagmi'
import { parseUnits, isAddress, getAddress } from 'viem'
import { useAccount, useBalance, useSendTransaction, useSimulateContract, useWriteContract, useWaitForTransaction } from 'wagmi'

// --- CONFIGURATION: ERC-20 ABI and ASSET LIST ---
const ERC20_ABI = [
  { type: 'function', name: 'transfer', inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
];

/**
 * Multi-chain Asset Configuration:
 * This structure maps token symbols to their properties and specific contract addresses 
 * for the chains you support (identified by their decimal Chain ID).
 * * You MUST replace the placeholder addresses with the official contract addresses 
 * for the respective tokens on each supported network.
 */
const ASSET_CONFIG = {
  "ETH": { // Native Asset (address: null for all chains)
    name: "Ethereum", 
    decimals: 18, 
    logo: "Ξ", 
    color: "text-blue-400",
    isNative: true,
    addresses: { '1': null, '10': null, '137': null, '42161': null, '8453': null, '11155111': null }, // Mainnet, Optimism, Polygon, Arbitrum, Base, Sepolia
  },
  "USDT": {
    name: "Tether USD",
    decimals: 6,
    logo: "$",
    color: "text-green-500",
    isNative: false,
    addresses: {
      '1': '0xdac17f958d2ceee5d6ff7da09aa7d98fa8c1bc29', // Mainnet USDT (Placeholder)
      '137': '0xc2132d05a96860d5c06bc2419f4a643d2c88d902', // Polygon USDT (Placeholder)
      '11155111': '0x...USDT_SEPOLIA_ADDRESS', // Sepolia Testnet USDT (Placeholder)
    }
  },
  "USDC": {
    name: "USD Coin",
    decimals: 6,
    logo: "¤", // Using a generic currency symbol
    color: "text-blue-500",
    isNative: false,
    addresses: {
      '1': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Mainnet USDC (Placeholder)
      '10': '0x7f5c764cbc14f9669b88837ca1490cca17c3160b', // Optimism USDC (Placeholder)
      '11155111': '0x...USDC_SEPOLIA_ADDRESS', // Sepolia Testnet USDC (Placeholder)
    }
  },
};

// Simplified list for the Select dropdown
const SUPPORTED_ASSET_SYMBOLS = Object.keys(ASSET_CONFIG);

/**
 * Helper to get the full asset configuration including the chain-specific address.
 * @param {string} symbol - The token symbol (e.g., "USDT")
 * @param {number} chainId - The decimal chain ID of the connected network
 * @returns {object | null} The full asset object with the resolved 'address' property.
 */
const getAssetConfig = (symbol, chainId) => {
    const config = ASSET_CONFIG[symbol];
    if (!config) return null;

    const chainIdStr = String(chainId);
    const tokenAddress = config.addresses[chainIdStr];
    
    // Only return the asset if the contract address exists for the current chain, 
    // or if it's a native asset (address is null).
    if (tokenAddress !== undefined) {
        return {
            symbol: symbol,
            name: config.name,
            decimals: config.decimals,
            logo: config.logo,
            color: config.color,
            isNative: config.isNative,
            address: tokenAddress,
        };
    }
    return null; // Asset not supported on the current chain
}

// Custom helper component for modal details
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);


export function SendPage() {
    const { address: senderAddress, isConnected, chain } = useAccount()
    const chainId = chain?.id;

    // Local State
    const [recipient, setRecipient] = useState("")
    const [selectedSymbol, setSelectedSymbol] = useState(SUPPORTED_ASSET_SYMBOLS[0])
    const [amount, setAmount] = useState("")
    const [errors, setErrors] = useState({})
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [txHash, setTxHash] = useState(null); // Used to track the transaction after broadcast
    const [isSending, setIsSending] = useState(false); // Controls the send button text

    // Dynamically resolve the full asset configuration based on symbol and connected chain
    const selectedAsset = useMemo(() => getAssetConfig(selectedSymbol, chainId), [selectedSymbol, chainId]);

    // --- WAGMI: REAL-TIME BALANCE FETCHING ---
    const { data: balanceData } = useBalance({
        address: senderAddress,
        // If the token is ERC-20, use its address; if native, use undefined
        token: selectedAsset?.address ? getAddress(selectedAsset.address) : undefined,
        chainId: chainId,
        enabled: isConnected && !!senderAddress && !!selectedAsset,
        watch: true,
    })

    const currentBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const currentBalanceDisplay = balanceData ? `${currentBalance.toFixed(4)}` : "0.0000";

    // --- VALIDATION & PREPARATION LOGIC ---
    const isRecipientValid = recipient && isAddress(recipient);
    const isValidAmount = Number(amount) > 0 && Number(amount) <= currentBalance;
    const isTokenSend = selectedAsset && !selectedAsset.isNative; // True if it's an ERC-20 token
    
    const sendAmountBigInt = useMemo(() => {
        if (!amount || !selectedAsset || !isValidAmount) return BigInt(0);
        try {
            return parseUnits(amount, selectedAsset.decimals);
        } catch (e) {
            return BigInt(0);
        }
    }, [amount, selectedAsset, isValidAmount]);
    
    const isPrepareEnabled = isConnected && isRecipientValid && isValidAmount && sendAmountBigInt > BigInt(0) && !!selectedAsset;

    // 1. Prepare NATIVE Coin Transaction (ETH)
    const { config: nativeConfig } = usePrepareSendTransaction({
        to: recipient,
        value: sendAmountBigInt,
        chainId: chainId,
        enabled: isPrepareEnabled && !isTokenSend,
    });

    // 2. Prepare ERC-20 Token Transaction (USDT, USDC, etc.)
    const { config: tokenConfig } = usePrepareWriteContract({
        address: selectedAsset?.address ? getAddress(selectedAsset.address) : undefined,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient, sendAmountBigInt],
        chainId: chainId,
        enabled: isPrepareEnabled && isTokenSend,
    });

    // Select the appropriate config
    const config = isTokenSend ? tokenConfig : nativeConfig;
    const isReadyToSign = !!config.request;

    // --- WAGMI: TRANSACTION EXECUTION ---
    const { sendTransaction } = useSendTransaction();
    const { writeContract } = useWriteContract();

    // Use the useWaitForTransaction hook to get final status
    const { data: txReceipt, isLoading: isConfirming, isSuccess: isConfirmed, isError: isFailed } = useWaitForTransaction({
        hash: txHash,
        enabled: !!txHash && txHash !== 'REJECTED',
    });
    
    // --- TRANSACTION HANDLERS ---
    
    const validateForm = () => {
        const newErrors = {};
        if (!isRecipientValid) {
            newErrors.recipient = "Invalid Ethereum address format (0x...)";
        }
        if (!selectedAsset) {
            newErrors.asset = `Asset not supported on the current chain (${chain?.name || 'Unknown'})`;
        }
        if (!isValidAmount) {
            newErrors.amount = Number(amount) > 0 ? `Amount exceeds your balance (${currentBalanceDisplay} ${selectedAsset?.symbol || ''})` : "Amount must be greater than zero";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePreviewTransaction = () => {
        if (!isReadyToSign) {
            // Force validation to show preparation errors from wagmi or local errors
            validateForm();
        }

        if (validateForm() && isReadyToSign) {
            // Reset any previous status
            setTxHash(null);
            setIsSending(false);
            setShowConfirmModal(true);
        }
    };

    const handleCompleteTransaction = async () => {
        if (!isReadyToSign) return;
        
        setIsSending(true);
        setTxHash(null);

        try {
            let data;
            if (isTokenSend) {
                data = await writeContract?.(tokenConfig.request);
            } else {
                data = await sendTransaction?.(nativeConfig.request);
            }
            
            if (data?.hash) {
                setTxHash(data.hash);
            }

        } catch (e) {
            console.error("Transaction broadcast failed or rejected:", e);
            setTxHash('REJECTED');
        } finally {
            setIsSending(false); 
        }
    };
    
    // --- MODAL RENDER LOGIC ---

    const getModalContent = () => {
        const explorerUrl = txHash && txHash !== 'REJECTED' ? `${chain?.blockExplorers?.default.url}/tx/${txHash}` : null;
        
        // 1. Final Status (Confirmed/Failed)
        if (txHash && txHash !== 'REJECTED' && (isConfirmed || isFailed)) {
            const isSuccess = isConfirmed && txReceipt?.status === 'success';
            return (
                <div className="text-center p-6 space-y-4">
                    {isSuccess ? (
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    ) : (
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    )}
                    <h2 className="text-2xl font-bold">{isSuccess ? "Transaction Successful!" : "Transaction Failed"}</h2>
                    <p className="text-muted-foreground">{isSuccess ? "Your funds have been sent." : "The transaction failed or reverted."}</p>
                    {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                            View on {chain?.blockExplorers?.default.name || 'Explorer'}
                        </a>
                    )}
                    <Button onClick={() => setShowConfirmModal(false)} className="w-full mt-4">Done</Button>
                </div>
            );
        }

        // 2. Awaiting Signature/Confirmation
        if (txHash === 'REJECTED' || isSending || (txHash && txHash !== 'REJECTED')) {
            if (txHash === 'REJECTED') {
                return (
                    <div className="text-center p-6 space-y-4">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold">Transaction Rejected</h2>
                        <p className="text-muted-foreground">The transaction was rejected by your wallet or encountered an immediate broadcast error.</p>
                        <Button onClick={() => setShowConfirmModal(false)} className="w-full mt-4">Close</Button>
                    </div>
                )
            }
            
            const statusText = isConfirming ? "Confirming on blockchain..." : "Awaiting signature...";

            return (
                <div className="text-center p-6 space-y-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <h2 className="text-xl font-bold">{statusText}</h2>
                    <p className="text-sm text-muted-foreground">
                        {txHash ? `Hash: ${truncateAddress(txHash)}` : "Please check your wallet to sign the transaction."}
                    </p>
                    <Button onClick={() => setShowConfirmModal(false)} variant="secondary" disabled={isConfirming} className="w-full mt-4">
                        {txHash ? "Close Status" : "Cancel"}
                    </Button>
                </div>
            );
        }

        // 3. Initial Confirmation Screen
        return (
            <>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Confirm Transaction</DialogTitle>
                    <DialogDescription className="text-center text-sm">Review the details before sending.</DialogDescription>
                </DialogHeader>
                <div className="p-4 space-y-4">
                    <DetailRow label="Recipient" value={truncateAddress(recipient)} />
                    <DetailRow label="Asset" value={selectedAsset?.name || selectedSymbol} />
                    <DetailRow label="Amount" value={`${amount} ${selectedAsset?.symbol || ''}`} />
                    <DetailRow label="Network" value={chain?.name || 'Unknown'} />
                    <div className="pt-2 border-t border-dashed border-border flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>{amount} {selectedAsset?.symbol || ''}</span>
                    </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-col gap-2 pt-4">
                    <Button 
                        onClick={handleCompleteTransaction} 
                        disabled={!isReadyToSign || isSending}
                        className="w-full h-12 bg-primary hover:bg-primary/90 transition-colors"
                    >
                        {isSending ? "Awaiting Signature..." : (isReadyToSign ? "Confirm and Send" : "Preparing Transaction...")}
                    </Button>
                    <Button onClick={() => setShowConfirmModal(false)} variant="outline" className="w-full h-12">
                        Cancel
                    </Button>
                </DialogFooter>
            </>
        );
    };

    return (
        <>
            <div className="p-4 space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 pt-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Send</h1>
                </div>

                {!isConnected && (
                    <Card className="text-center p-6 space-y-3 border-yellow-500 bg-yellow-900/10">
                        <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto" />
                        <p className="font-semibold">Wallet Disconnected</p>
                        <p className="text-sm text-muted-foreground">Please connect your wallet to use the send feature.</p>
                    </Card>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ pointerEvents: !isConnected ? 'none' : 'auto' }}>
                    {/* Left Column - Address and Token Selector */}
                    <div className="space-y-6 opacity-100 transition-opacity">
                        {/* Recipient Address */}
                        <Card className="p-4 space-y-4">
                            <Label htmlFor="recipient" className="text-sm font-medium">Recipient Address</Label>
                            <div className="relative">
                                <Input
                                    id="recipient"
                                    placeholder="Enter wallet address or ENS name"
                                    value={recipient}
                                    onChange={(e) => {
                                        setRecipient(e.target.value)
                                        setErrors((prev) => ({ ...prev, recipient: "" }))
                                    }}
                                    className={cn(
                                        "pr-20 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                                        errors.recipient && "border-destructive animate-shake",
                                    )}
                                    disabled={!isConnected}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Scan className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><User className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            {errors.recipient && (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="h-4 w-4" />{errors.recipient}
                                </div>
                            )}
                        </Card>

                        {/* Asset Selection */}
                        <Card className="p-4 space-y-4">
                            <Label className="text-sm font-medium">
                                Select Asset <span className="text-xs text-muted-foreground">({chain?.name || 'Network'})</span>
                            </Label>
                            <Select
                                value={selectedSymbol}
                                onValueChange={(value) => {
                                    setSelectedSymbol(value)
                                    setErrors((prev) => ({ ...prev, asset: "" }))
                                }}
                            >
                                <SelectTrigger className={cn(
                                    "transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                                    errors.asset && "border-destructive",
                                )}
                                disabled={!isConnected}
                                >
                                    <SelectValue placeholder="Choose cryptocurrency">
                                        {selectedAsset && (
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${selectedAsset.color}`}>
                                                    <span className="text-sm font-bold">{selectedAsset.logo}</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium">{selectedAsset.symbol}</p>
                                                    <p className="text-xs text-muted-foreground">Balance: {currentBalanceDisplay}</p>
                                                </div>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORTED_ASSET_SYMBOLS.map((symbol) => {
                                        const assetConfig = getAssetConfig(symbol, chainId);
                                        // Only show assets that are supported on the current chain
                                        if (!assetConfig) return null;
                                        
                                        return (
                                            <SelectItem key={symbol} value={symbol}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${assetConfig.color}`}>
                                                        <span className="text-sm font-bold">{assetConfig.logo}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{assetConfig.symbol}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {symbol === selectedSymbol ? `Balance: ${currentBalanceDisplay} ${assetConfig.symbol}` : 'Available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.asset && (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="h-4 w-4" />{errors.asset}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Column - Amount and Send Button */}
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <Card className="p-4 space-y-4">
                            <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                            <div className="space-y-2">
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value)
                                        setErrors((prev) => ({ ...prev, amount: "" }))
                                    }}
                                    className={cn(
                                        "text-2xl font-bold text-center transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                                        errors.amount && "border-destructive animate-shake",
                                    )}
                                    disabled={!isConnected}
                                />
                                {selectedAsset && (
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            Available: {currentBalanceDisplay} {selectedAsset.symbol}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-primary"
                                            onClick={() => setAmount(String(currentBalance))}
                                        >
                                            Max
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {errors.amount && (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="h-4 w-4" />{errors.amount}
                                </div>
                            )}
                        </Card>

                        {/* Transaction Fee (Placeholder) */}
                        {selectedAsset && amount && (
                            <Card className="p-4 animate-in slide-in-from-bottom duration-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Network Fee (Est.)</span>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">~0.0001 {chain?.nativeCurrency.symbol || 'ETH'}</p>
                                        <p className="text-xs text-muted-foreground">≈ $TBD</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Preview Transaction Button */}
                        <Button
                            onClick={handlePreviewTransaction}
                            className={cn("w-full h-14 text-lg font-semibold gradient-purple-blue hover:opacity-90 transition-all duration-200 active:scale-95", {
                                'opacity-50 cursor-not-allowed': !isConnected || !recipient || !selectedAsset || !amount || !isReadyToSign
                            })}
                            disabled={!isConnected || !recipient || !selectedAsset || !amount || !isReadyToSign}
                        >
                            {isReadyToSign ? "Preview Transaction" : <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Preparing Transaction...</>}
                        </Button>
                        
                        {/* Preparation Error hint */}
                        {!isReadyToSign && isConnected && recipient && selectedAsset && amount && (
                            <p className="text-xs text-center text-red-400">
                                Could not prepare transaction. Check network status, recipient, or balance.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* CONFIRMATION / STATUS MODAL */}
            <Dialog open={showConfirmModal} onOpenChange={(open) => {
                // Only allow closing if no transaction is actively waiting for confirmation
                if (!txHash) setShowConfirmModal(open);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    {getModalContent()}
                </DialogContent>
            </Dialog>
        </>
    )
}

"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
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
import { truncateAddress } from '../lib/utils' // Assuming this is correctly defined

// WAGMI/VIEM IMPORTS
import {
    parseUnits,
    isAddress,
    getAddress,
    TransactionExecutionError,
} from 'viem'
import {
    useAccount,
    useBalance,
    useSendTransaction,
    useSimulateContract, // NOW USED FOR BOTH NATIVE AND ERC-20
    // useSimulateTransaction, // <--- REMOVED: Caused export error
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi'


// --- CONFIGURATION: ERC-20 ABI and ASSET LIST (Standard JS Object/Array) ---
const ERC20_ABI = [
    { type: 'function', name: 'transfer', inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
    { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
];

const ASSET_CONFIG = {
    "ETH": {
        name: "Ethereum",
        decimals: 18,
        logo: "Ξ",
        color: "text-blue-400",
        isNative: true,
        addresses: { '1': null, '10': null, '137': null, '42161': null, '8453': null, '11155111': null },
    },
    "USDT": {
        name: "Tether USD",
        decimals: 6,
        logo: "$",
        color: "text-green-500",
        isNative: false,
        addresses: {
            '1': '0xdAC17F958D2ee5237c95619A80b8b20e0605a96A', // Mainnet USDT (Mocked for validity)
            '137': '0xc2132d05a96860c6d5c06BC2419f4a643d2C88D2', // Polygon USDT (Mocked for validity)
            '11155111': '0x742dC2524d7b27D9A440c94bA7E5F9c2776E08f4', // Sepolia Testnet USDT (Mocked for validity)
        }
    },
    "USDC": {
        name: "USD Coin",
        decimals: 6,
        logo: "¤",
        color: "text-blue-500",
        isNative: false,
        addresses: {
            '1': '0xA0b86991c6218b36c1d19D4a2e9eb0cE3606eB48', // Mainnet USDC (Mocked for validity)
            '10': '0x7F5c764cBc14f9669b88837Ca1490Cca17C3160B', // Optimism USDC (Mocked for validity)
            '11155111': '0x49fA44B663dD380482B7b43c6838Dcb80E341490', // Sepolia Testnet USDC (Mocked for validity)
        }
    },
};

const SUPPORTED_ASSET_SYMBOLS = Object.keys(ASSET_CONFIG);

/**
 * Helper to get the full asset configuration including the chain-specific address.
 */
const getAssetConfig = (symbol, chainId) => {
    const config = ASSET_CONFIG[symbol];
    if (!config) return null;

    const chainIdStr = String(chainId);
    const tokenAddress = config.addresses[chainIdStr];

    if (tokenAddress !== undefined) {
        return {
            symbol: symbol,
            name: config.name,
            decimals: config.decimals,
            logo: config.logo,
            color: config.color,
            isNative: config.isNative,
            address: tokenAddress ? getAddress(tokenAddress) : null, // Uses getAddress from viem
        };
    }
    return null;
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
    const [txHash, setTxHash] = useState(null); // String | 'REJECTED' | 'BROADCAST_FAILED'
    const [isSending, setIsSending] = useState(false); // True while awaiting wallet signature
    const [simulateError, setSimulateError] = useState(null); // General error message for simulation failure

    // Dynamic configuration based on state
    const selectedAsset = useMemo(() => getAssetConfig(selectedSymbol, chainId), [selectedSymbol, chainId]);

    // --- WAGMI: REAL-TIME BALANCE FETCHING ---
    const { data: balanceData } = useBalance({
        address: senderAddress,
        token: selectedAsset?.address || undefined,
        chainId: chainId,
        enabled: isConnected && !!senderAddress && !!selectedAsset,
        watch: true,
    })

    const currentBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const currentBalanceDisplay = balanceData ? `${currentBalance.toFixed(4)}` : "0.0000";

    // --- VALIDATION & PREPARATION LOGIC ---
    const normalizedRecipient = useMemo(() => {
        if (!recipient) return null;
        try {
            return isAddress(recipient) ? getAddress(recipient) : null;
        } catch {
            return null;
        }
    }, [recipient])

    const isRecipientValid = !!normalizedRecipient;
    const isValidAmount = Number(amount) > 0 && Number(amount) <= currentBalance;
    const isTokenSend = selectedAsset && !selectedAsset.isNative;

    const sendAmountBigInt = useMemo(() => {
        if (!amount || !selectedAsset) return BigInt(0);
        try {
            const numAmount = Number(amount);
            if (numAmount > 0) {
                return parseUnits(amount, selectedAsset.decimals);
            }
            return BigInt(0);
        } catch (e) {
            console.warn("Failed to parse amount to BigInt:", e);
            return BigInt(0);
        }
    }, [amount, selectedAsset]);

    const isPrepareEnabled = isConnected && isRecipientValid && isValidAmount && sendAmountBigInt > BigInt(0) && !!selectedAsset;

    // 1. Simulate NATIVE Coin Transaction (ETH)
    // <--- FIX APPLIED HERE: Using useSimulateContract for native transfer
    const {
        data: nativeSimulateData,
        isLoading: isNativeSimulating,
        error: nativeSimulateError,
    } = useSimulateContract({ // <--- Use useSimulateContract
        address: undefined,      // Explicitly undefined for native
        abi: undefined,          // Explicitly undefined for native
        functionName: undefined, // Explicitly undefined for native
        args: undefined,         // Explicitly undefined for native
        to: normalizedRecipient || undefined,
        value: sendAmountBigInt,
        chainId: chainId,
        query: {
            enabled: isPrepareEnabled && !isTokenSend,
            staleTime: 5000,
        },
    });

    // 2. Simulate ERC-20 Token Transaction 
    const {
        data: tokenSimulateData,
        isLoading: isTokenSimulating,
        error: tokenSimulateError,
    } = useSimulateContract({
        address: selectedAsset?.address || undefined,
        abi: ERC20_ABI,
        functionName: 'transfer',
        // In JavaScript, a placeholder address like '0x' might not be recognized as a valid Address type
        // in viem's internal checks, but since `enabled` is gated by `isRecipientValid`, 
        // `normalizedRecipient` will be a valid address when this is active.
        args: [normalizedRecipient || '0x', sendAmountBigInt],
        chainId: chainId,
        query: {
            enabled: isPrepareEnabled && isTokenSend && !!selectedAsset?.address,
            staleTime: 5000,
        },
    });

    // Select the appropriate config and error
    const config = isTokenSend ? tokenSimulateData : nativeSimulateData;
    const currentSimulateError = isTokenSend ? tokenSimulateError : nativeSimulateError;

    const isReadyToSign = !!config?.request;
    const isSimulating = isTokenSend ? isTokenSimulating : isNativeSimulating;

    // --- EFFECT: Handle Simulation Errors ---
    useEffect(() => {
        if (isPrepareEnabled && currentSimulateError) {
            console.error("Simulation Error:", currentSimulateError);
            setSimulateError("Transaction simulation failed. Check for contract errors, gas, or token address support.");
        } else if (isPrepareEnabled && !isSimulating && !isReadyToSign) {
            setSimulateError("Transaction parameters invalid or missing.");
        } else {
            setSimulateError(null);
        }
    }, [isPrepareEnabled, currentSimulateError, isSimulating, isReadyToSign]);


    // --- WAGMI: TRANSACTION EXECUTION HOOKS ---
    const { sendTransactionAsync } = useSendTransaction();
    const { writeContractAsync } = useWriteContract();

    // Use the useWaitForTransactionReceipt hook to get final status
    const {
        data: txReceipt,
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isFailed
    } = useWaitForTransactionReceipt({
        hash: txHash && txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' ? txHash : undefined,
        chainId: chainId,
        query: { enabled: !!txHash && txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' },
    });

    // --- TRANSACTION HANDLERS ---

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!isRecipientValid) {
            newErrors.recipient = "Invalid Ethereum address format (0x...)";
        }
        if (!selectedAsset) {
            newErrors.asset = `Asset not supported on the current chain (${chain?.name || 'Unknown'})`;
        } else if (isTokenSend && !selectedAsset.address) {
            newErrors.asset = `Token contract address is missing for this chain.`;
        }
        if (!isValidAmount) {
            newErrors.amount = Number(amount) > 0 ? `Amount exceeds your balance (${currentBalanceDisplay} ${selectedAsset?.symbol || ''})` : "Amount must be greater than zero";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0 && !simulateError && isReadyToSign;
    }, [isRecipientValid, selectedAsset, isTokenSend, isValidAmount, amount, currentBalanceDisplay, chain?.name, simulateError, isReadyToSign]);


    const handlePreviewTransaction = () => {
        if (validateForm() && isReadyToSign) {
            setTxHash(null);
            setIsSending(false);
            setShowConfirmModal(true);
        } else {
            validateForm();
        }
    };

    const handleCompleteTransaction = async () => {
        if (!isReadyToSign || !config?.request) return;

        setIsSending(true);
        setTxHash(null);

        try {
            let data;

            // Use the spread operator to pass the prepared config object
            if (isTokenSend) {
                // ERC-20: Use writeContractAsync
                data = await writeContractAsync({ ...config.request });
            } else {
                // Native: Use sendTransactionAsync
                // The config.request here comes from useSimulateContract, but is structured correctly
                data = await sendTransactionAsync({ ...config.request });
            }

            if (data?.hash) {
                setTxHash(data.hash);
            }

        } catch (e) {
            console.error("Transaction broadcast failed or rejected:", e);
            setIsSending(false);

            // Check for user rejection or broadcast failure
            if (e instanceof TransactionExecutionError && e.message.includes('User rejected the request')) {
                setTxHash('REJECTED');
            } else {
                setTxHash('BROADCAST_FAILED');
            }

        }
    };

    // --- MODAL RENDER LOGIC ---

    const getModalContent = () => {
        const explorerUrl = txHash && txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' ? `${chain?.blockExplorers?.default.url}/tx/${txHash}` : null;

        // 1. Final Status (Confirmed/Failed/Rejected/Broadcast Failed)
        if (txHash) {
            const isSuccess = isConfirmed && txReceipt?.status === 'success';
            const isReverted = isConfirmed && txReceipt?.status === 'reverted';
            const isFinalFailure = isFailed || isReverted || txHash === 'REJECTED' || txHash === 'BROADCAST_FAILED';
            const isAwaitingConfirmation = txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' && (isSending || isConfirming || (!isFinalFailure && !isSuccess));


            // Awaiting Confirmation/Signature
            if (isAwaitingConfirmation) {
                const statusText = isConfirming ? "Confirming on blockchain..." : "Awaiting wallet signature...";

                return (
                    <div className="text-center p-6 space-y-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                        <h2 className="text-xl font-bold">{statusText}</h2>
                        <p className="text-sm text-muted-foreground">
                            {txHash ? `Hash: ${truncateAddress(txHash)}` : "Please check your wallet to sign the transaction."}
                        </p>
                        {explorerUrl && txHash && (
                            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                                View on {chain?.blockExplorers?.default.name || 'Explorer'}
                            </a>
                        )}
                        <Button onClick={() => setShowConfirmModal(false)} variant="secondary" disabled={isConfirming} className="w-full mt-4">
                            {txHash ? "Close Status" : "Cancel"}
                        </Button>
                    </div>
                );
            }

            // Explicit Failures (User Rejected or Broadcast Failed)
            if (txHash === 'REJECTED' || txHash === 'BROADCAST_FAILED') {
                const title = txHash === 'REJECTED' ? "Transaction Rejected" : "Broadcast Failed";
                const message = txHash === 'REJECTED' ? "The transaction was explicitly rejected by your wallet." : "An error occurred broadcasting the transaction. Try again.";
                return (
                    <div className="text-center p-6 space-y-4">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <p className="text-muted-foreground">{message}</p>
                        <Button onClick={() => setShowConfirmModal(false)} className="w-full mt-4">Close</Button>
                    </div>
                );
            }

            // Final Result (Confirmed on chain: Success/Reverted)
            return (
                <div className="text-center p-6 space-y-4">
                    {isSuccess ? (
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    ) : (
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    )}
                    <h2 className="text-2xl font-bold">{isSuccess ? "Transaction Successful! 🎉" : "Transaction Failed ❌"}</h2>
                    <p className="text-muted-foreground">{isSuccess ? "Your funds have been sent." : isReverted ? "The transaction failed (reverted) on-chain." : "The transaction failed or reverted."}</p>
                    {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                            View on {chain?.blockExplorers?.default.name || 'Explorer'}
                        </a>
                    )}
                    <Button onClick={() => {
                        setShowConfirmModal(false);
                        setTxHash(null);
                        setRecipient("");
                        setAmount("");
                    }} className="w-full mt-4">Done</Button>
                </div>
            );
        }

        // 2. Initial Confirmation Screen
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
                    <DetailRow label="Est. Network Fee" value={`~0.0001 ${chain?.nativeCurrency.symbol || 'ETH'}`} />
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
                        {isSending ? "Awaiting Signature..." : (isReadyToSign ? "Confirm and Send" : "Preparation Error")}
                    </Button>
                    <Button onClick={() => setShowConfirmModal(false)} variant="outline" className="w-full h-12">
                        Cancel
                    </Button>
                </DialogFooter>
            </>
        );
    };

    // Determine main button state text
    const mainButtonText = useMemo(() => {
        if (!isConnected) return "Connect Wallet";
        if (isSimulating) {
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing Transaction...</>;
        }
        if (Object.keys(errors).length > 0) {
            return "Review Form Errors";
        }
        if (simulateError) {
            return "Simulation Failed (Check Errors)";
        }
        if (isReadyToSign) {
            return "Preview Transaction";
        }
        return "Enter Details";
    }, [isConnected, isSimulating, simulateError, errors, isReadyToSign]);

    // Determine if the main button should be disabled
    const isMainButtonDisabled = !isConnected || !recipient || !selectedAsset || !amount || isSimulating || simulateError || !isReadyToSign;


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
                                        setSimulateError(null)
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
                                    setSimulateError(null)
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
                                        const value = e.target.value.replace(/[^\d.]/g, '')
                                        setAmount(value)
                                        setErrors((prev) => ({ ...prev, amount: "" }))
                                        setSimulateError(null)
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
                            disabled={isMainButtonDisabled}
                            className={cn("w-full h-14 text-lg font-semibold gradient-purple-blue hover:opacity-90 transition-all duration-200 active:scale-95", {
                                'opacity-50 cursor-not-allowed': isMainButtonDisabled
                            })}
                        >
                            {mainButtonText}
                        </Button>

                        {/* Preparation Error hint (from simulation failure) */}
                        {simulateError && (
                            <p className="text-xs text-center text-destructive">
                                <AlertCircle className="mr-1 h-3 w-3 inline" />{simulateError}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* CONFIRMATION / STATUS MODAL */}
            <Dialog open={showConfirmModal} onOpenChange={(open) => {
                if (!isSending && !isConfirming) {
                    setShowConfirmModal(open);
                    if (!open && !txHash) {
                        setTxHash(null);
                        setIsSending(false);
                    }
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    {getModalContent()}
                </DialogContent>
            </Dialog>
        </>
    );
}
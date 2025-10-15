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
    useSimulateContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    // 🎯 NEW IMPORT: useSwitchChain for smooth network change
    useSwitchChain, 
} from 'wagmi'
import { BottomNavigation } from "./bottom-navigation"

// --- 🎯 SOLUTION STEP 1: EXPAND CONFIGURATION FOR ALL ASSETS AND CHAINS ---
// -------------------------------------------------------------------------

/**
 * Maps Chain IDs to a display name and logo for use in the dropdown.
 * Added chainId (number) for use with the wagmi useSwitchChain hook.
 * Chain IDs: 1 (Ethereum), 10 (Optimism/OP), 137 (Polygon/MATIC), 56 (BNB Chain/BNB), 42161 (Arbitrum/ARB), 8453 (Base/BASE)
 */
const CHAIN_CONFIG = {
    // Mainnets
    '1': { name: 'Ethereum', symbol: 'ETH', nativeSymbol: 'ETH', chainId: 1 },
    '10': { name: 'Optimism', symbol: 'OP', nativeSymbol: 'ETH', chainId: 10 },
    '137': { name: 'Polygon', symbol: 'MATIC', nativeSymbol: 'MATIC', chainId: 137 },
    '56': { name: 'BNB Chain', symbol: 'BNB', nativeSymbol: 'BNB', chainId: 56 },
    '42161': { name: 'Arbitrum', symbol: 'ARB', nativeSymbol: 'ETH', chainId: 42161 },
    '8453': { name: 'Base', symbol: 'BASE', nativeSymbol: 'ETH', chainId: 8453 },
    // Testnet (for stablecoin address mocks)
    '11155111': { name: 'Sepolia', symbol: 'SEP', nativeSymbol: 'ETH', chainId: 11155111 },
};

const ERC20_ABI = [
    { type: 'function', name: 'transfer', inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
    { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
];

/**
 * Main asset configuration.
 */
const ASSET_CONFIG_BASE = {
    // --- NATIVE ASSETS (Must be sent from their respective native network) ---
    "ETH": {
        name: "Ethereum",
        decimals: 18,
        logo: "Ξ",
        color: "text-blue-400",
        isNative: true,
        addresses: { '1': null }, // ETH is native to Chain ID 1 (Ethereum)
    },
    "ARB": {
        name: "Arbitrum",
        decimals: 18,
        logo: "A",
        color: "text-blue-500",
        isNative: true,
        addresses: { '42161': null }, // ARB is native gas to Chain ID 42161 (Arbitrum)
    },
    "OP": {
        name: "Optimism",
        decimals: 18,
        logo: "🔴",
        color: "text-red-500",
        isNative: true,
        addresses: { '10': null }, // OP is native gas to Chain ID 10 (Optimism)
    },
    "BASE": {
        name: "Base",
        decimals: 18,
        logo: "B",
        color: "text-blue-600",
        isNative: true,
        addresses: { '8453': null }, // BASE is native gas to Chain ID 8453 (Base)
    },
    "MATIC": {
        name: "Polygon",
        decimals: 18,
        logo: "M",
        color: "text-purple-500",
        isNative: true,
        addresses: { '137': null }, // MATIC is native gas to Chain ID 137 (Polygon)
    },
    "BNB": {
        name: "BNB",
        decimals: 18,
        logo: "B",
        color: "text-yellow-500",
        isNative: true,
        addresses: { '56': null }, // BNB is native gas to Chain ID 56 (BNB Chain)
    },

    // --- ERC-20 STABLECOINS ---
    "USDT": {
        name: "Tether USD",
        decimals: 6,
        logo: "$",
        color: "text-green-500",
        isNative: false,
        addresses: {
            '1': '0xdAC17F958D2ee5237c95619A80b8b20e0605a96A', // Ethereum Mainnet USDT
            '137': '0xc2132d05a96860c6d5c06BC2419f4a643d2C88D2', // Polygon Mainnet USDT
            '56': '0x55d398326f99059fF775485246999027B3197955', // BNB Chain Mainnet USDT
        }
    },
    "USDC": {
        name: "USD Coin",
        decimals: 6,
        logo: "¤",
        color: "text-blue-500",
        isNative: false,
        addresses: {
            '1': '0xA0b86991c6218b36c1d19D4a2e9eb0cE3606eB48', // Ethereum Mainnet USDC
            '137': '0x3c499c542cE5E3cc0503E878A1eE970d5dFEaF8c', // Polygon Mainnet USDC
            '56': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // BNB Chain Mainnet USDC
        }
    },
};

/**
 * GENERATE A UNIQUE, FLAT LIST OF ALL AVAILABLE ASSETS.
 */
const ALL_ASSET_IDS = Object.entries(ASSET_CONFIG_BASE).flatMap(([symbol, config]) =>
    Object.keys(config.addresses).map(chainId => `${symbol}-${chainId}`)
);

/**
 * Helper to get the full asset configuration including the chain-specific address and display name.
 */
const getAssetConfig = (assetId, currentChainId) => {
    if (!assetId) return null;
    const [symbol, configChainIdStr] = assetId.split('-');
    const config = ASSET_CONFIG_BASE[symbol];
    const assetChainConfig = CHAIN_CONFIG[configChainIdStr];

    if (!config || !assetChainConfig) return null;

    const isAvailableOnCurrentChain = String(currentChainId) === configChainIdStr;

    const tokenAddress = config.addresses[configChainIdStr];

    const displayLabel = config.isNative
        ? symbol
        : `${symbol} (${assetChainConfig.name})`;

    // The address used for the wagmi `useBalance` or `useSimulateContract` hooks.
    const tokenAddressOrNull = tokenAddress ? getAddress(tokenAddress) : null;
    
    // For native tokens, the balance hook requires no token address, but we set the tokenSymbol to its native symbol
    // to allow a check for balance and a value in the select display.
    const wagmiTokenAddress = config.isNative ? undefined : tokenAddressOrNull;

    return {
        id: assetId, // Unique ID: e.g., 'USDT-137'
        symbol: symbol, // Base Symbol: e.g., 'USDT'
        name: config.name,
        decimals: config.decimals,
        logo: config.logo,
        color: config.color,
        isNative: config.isNative,
        chainName: assetChainConfig.name,
        // 🎯 NEW: The required chain ID number for the switchChain hook
        requiredChainId: assetChainConfig.chainId, 
        // The *required* token address for ERC-20 contract calls (null for native)
        address: tokenAddressOrNull, 
        // The token address for the wagmi useBalance hook (undefined for native)
        wagmiTokenAddress: wagmiTokenAddress,
        isAvailableOnCurrentChain: isAvailableOnCurrentChain,
        displayLabel: displayLabel,
    };
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
    // Use an explicit string for chainId to match the config keys
    const chainIdStr = String(chain?.id);
    const chainId = chain?.id;

    // 🎯 NEW: Hook to allow users to switch chains easily
    const { switchChain } = useSwitchChain();

    // Local State
    // 🎯 SOLUTION STEP 3: Use an assetId (e.g., 'ETH-1' or 'USDT-137') to track the selection
    const [selectedAssetId, setSelectedAssetId] = useState(ALL_ASSET_IDS.find(id => id.endsWith(`-${chainId}`)) || ALL_ASSET_IDS[0]);
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [errors, setErrors] = useState({})
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [txHash, setTxHash] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [simulateError, setSimulateError] = useState(null);

    // Dynamic configuration based on state
    // selectedAsset now contains all derived info: symbol, address, isNative, chainName, requiredChainId, etc.
    const selectedAsset = useMemo(() => getAssetConfig(selectedAssetId, chainId), [selectedAssetId, chainId]);

    // --- WAGMI: REAL-TIME BALANCE FETCHING ---
    const { data: balanceData } = useBalance({
        address: senderAddress,
        // Use the token address for ERC-20s, or undefined for native balance
        token: selectedAsset?.wagmiTokenAddress, 
        chainId: chainId,
        enabled: isConnected && !!senderAddress && !!selectedAsset && selectedAsset.isAvailableOnCurrentChain,
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
    // Check if the selected asset is an ERC-20 token
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
    
    // Check if the asset is supported on the *currently connected* chain
    const isAssetSupportedOnChain = selectedAsset?.isAvailableOnCurrentChain;

    const isPrepareEnabled = isConnected 
        && isRecipientValid 
        && isValidAmount 
        && sendAmountBigInt > BigInt(0) 
        && !!selectedAsset 
        && isAssetSupportedOnChain; // Must be on the correct chain

    // 1. Simulate NATIVE Coin Transaction
    // Enabled only if it's a native asset AND is supported on the current chain.
    const {
        data: nativeSimulateData,
        isLoading: isNativeSimulating,
        error: nativeSimulateError,
    } = useSimulateContract({
        address: undefined,      
        abi: undefined,          
        functionName: undefined, 
        args: undefined,         
        to: normalizedRecipient || undefined,
        value: sendAmountBigInt,
        chainId: chainId,
        query: {
            enabled: isPrepareEnabled && !isTokenSend,
            staleTime: 5000,
        },
    });

    // 2. Simulate ERC-20 Token Transaction 
    // Enabled only if it's an ERC-20 asset, has an address, AND is supported on the current chain.
    const {
        data: tokenSimulateData,
        isLoading: isTokenSimulating,
        error: tokenSimulateError,
    } = useSimulateContract({
        address: selectedAsset?.address || undefined, // Use the contract address
        abi: ERC20_ABI,
        functionName: 'transfer',
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
            // Note: This block is less likely to hit now that `isAssetSupportedOnChain` is a hard requirement for prep
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
            newErrors.asset = "Invalid asset selection.";
        } else if (!selectedAsset.isAvailableOnCurrentChain) {
            // NOTE: The main button handles this, but we keep the error for form completeness
            newErrors.asset = `The selected asset (${selectedAsset.symbol}) must be sent from its native network (${selectedAsset.chainName}).`;
        } else if (isTokenSend && !selectedAsset.address) {
            newErrors.asset = `Token contract address is missing for this chain.`;
        }
        if (!isValidAmount) {
            newErrors.amount = Number(amount) > 0 ? `Amount exceeds your balance (${currentBalanceDisplay} ${selectedAsset?.symbol || ''})` : "Amount must be greater than zero";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0 && !simulateError && isReadyToSign && isAssetSupportedOnChain;
    }, [isRecipientValid, selectedAsset, isTokenSend, isValidAmount, amount, currentBalanceDisplay, simulateError, isReadyToSign, isAssetSupportedOnChain]);


    const handlePreviewTransaction = () => {
        if (validateForm() && isReadyToSign) {
            setTxHash(null);
            setIsSending(false);
            setShowConfirmModal(true);
        } else {
            // Re-validate to display up-to-date errors
            validateForm();
        }
    };

    const handleCompleteTransaction = async () => {
        if (!isReadyToSign || !config?.request) return;

        setIsSending(true);
        setTxHash(null);

        try {
            let data;
            
            if (isTokenSend) {
                // ERC-20: Use writeContractAsync
                data = await writeContractAsync({ ...config.request });
            } else {
                // Native: Use sendTransactionAsync
                data = await sendTransactionAsync({ ...config.request });
            }

            if (data?.hash) {
                setTxHash(data.hash);
            }

        } catch (e) {
            console.error("Transaction broadcast failed or rejected:", e);
            setIsSending(false);

            if (e instanceof TransactionExecutionError && e.message.includes('User rejected the request')) {
                setTxHash('REJECTED');
            } else {
                setTxHash('BROADCAST_FAILED');
            }

        }
    };
    
    // 🎯 NEW: Handler to switch the network
    const handleSwitchChain = () => {
        if (selectedAsset?.requiredChainId && switchChain) {
            switchChain({ chainId: selectedAsset.requiredChainId });
        }
    };
    

    // --- MODAL RENDER LOGIC (No changes needed here) ---

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
                    {/* Display the more descriptive label here */}
                    <DetailRow label="Asset" value={selectedAsset?.displayLabel || selectedAsset?.symbol || ''} /> 
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
        if (!isAssetSupportedOnChain) {
            return `Switch to ${selectedAsset?.chainName}`; // Just say Switch
        }
        if (simulateError) {
            return "Simulation Failed (Check Errors)";
        }
        if (isReadyToSign) {
            return "Preview Transaction";
        }
        return "Enter Details";
    }, [isConnected, isSimulating, simulateError, errors, isReadyToSign, isAssetSupportedOnChain, selectedAsset?.chainName]);

    // Determine if the main button should be disabled
    // It's ONLY disabled if we are missing form data, simulating, or if the simulation failed.
    // The switch button logic handles the !isAssetSupportedOnChain case.
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
                
                {/* 🎯 Updated Alert for Mismatched Chain/Asset - Now includes a Switch Button */}
                {isConnected && selectedAsset && !isAssetSupportedOnChain && (
                    <Card className="p-4 space-y-4 border-red-500 bg-red-900/10">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm font-semibold text-red-300">
                                Incorrect Network: Please switch to **{selectedAsset.chainName}** to send **{selectedAsset.symbol}**.
                            </p>
                        </div>
                        <Button 
                            onClick={handleSwitchChain}
                            className="w-full bg-red-600 hover:bg-red-700 transition-colors"
                            disabled={!switchChain}
                        >
                            Switch to {selectedAsset.chainName}
                        </Button>
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
                                value={selectedAssetId} // Use the unique ID
                                onValueChange={(value) => {
                                    setSelectedAssetId(value)
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
                                                    {/* Use the descriptive label for the main display */}
                                                    <p className="font-medium">{selectedAsset.displayLabel}</p> 
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedAsset.isAvailableOnCurrentChain ? `Balance: ${currentBalanceDisplay}` : `Required: ${selectedAsset.chainName}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_ASSET_IDS.map(assetId => {
                                        const asset = getAssetConfig(assetId, chainId);
                                        if (!asset) return null;

                                        return (
                                            <SelectItem key={assetId} value={assetId}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${asset.color}`}>
                                                        <span className="text-sm font-bold">{asset.logo}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium">{asset.displayLabel}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {asset.isAvailableOnCurrentChain 
                                                                ? `Current Network: ${asset.chainName}` 
                                                                : `Switch to: ${asset.chainName}`
                                                            }
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

                    {/* Right Column - Amount Input and Transaction Details */}
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <Card className="p-4 space-y-4">
                            <div className="flex justify-between items-end">
                                <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                                <div className="text-xs text-muted-foreground">
                                    Balance: 
                                    <span 
                                        className="ml-1 cursor-pointer text-primary hover:text-primary/80 transition-colors"
                                        onClick={() => {
                                            if (currentBalance > 0 && selectedAsset?.isAvailableOnCurrentChain) {
                                                // Set max amount, accounting for a small buffer for gas if it's the native coin
                                                setAmount(currentBalance.toFixed(selectedAsset.decimals > 8 ? 6 : selectedAsset.decimals));
                                            }
                                        }}
                                    >
                                        {currentBalanceDisplay} {selectedAsset?.symbol || '...'}
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value)
                                        setErrors((prev) => ({ ...prev, amount: "" }))
                                        setSimulateError(null)
                                    }}
                                    className={cn(
                                        "pr-16 text-2xl h-14 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                                        errors.amount && "border-destructive animate-shake"
                                    )}
                                    disabled={!isConnected || !selectedAsset}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                                    {selectedAsset?.symbol || ''}
                                </span>
                            </div>
                            {errors.amount && (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="h-4 w-4" />{errors.amount}
                                </div>
                            )}
                        </Card>

                        {/* Error/Simulation Status */}
                        {(simulateError || (isReadyToSign && !isAssetSupportedOnChain)) && (
                            <Card className="p-4 space-y-2 border-red-500 bg-red-900/10">
                                <div className="flex items-start gap-2 text-red-300">
                                    <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                                    <p className="text-sm font-medium">
                                        {isAssetSupportedOnChain ? simulateError : `Cannot proceed: Switch to ${selectedAsset?.chainName} to send ${selectedAsset?.symbol}.`}
                                    </p>
                                </div>
                            </Card>
                        )}
                        
                        {/* Main Action Button */}
                        {isAssetSupportedOnChain ? (
                            <Button
                                onClick={handlePreviewTransaction}
                                disabled={isMainButtonDisabled}
                                className="w-full h-12 text-lg transition-transform duration-150 active:scale-[0.99]"
                            >
                                {mainButtonText}
                            </Button>
                        ) : (
                            // 🎯 Fallback button to switch chain, which replaces the send button
                            <Button 
                                onClick={handleSwitchChain}
                                className="w-full h-12 text-lg transition-transform duration-150 active:scale-[0.99]"
                                disabled={!selectedAsset?.requiredChainId || !switchChain}
                            >
                                Switch to {selectedAsset?.chainName || 'Correct Network'}
                            </Button>
                        )}

                        {/* Connected Chain Info */}
                        <div className="text-center text-sm text-muted-foreground pt-2">
                            Connected to: <span className="font-semibold text-primary">{chain?.name || "No Network"}</span>
                        </div>
                    </div>
                </div>
                <BottomNavigation />
            </div>

            {/* Confirmation Modal */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="sm:max-w-[425px]">
                    {getModalContent()}
                </DialogContent>
            </Dialog>
        </>
    )
}
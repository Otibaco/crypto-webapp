"use client"

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { ArrowLeft, Scan, User, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { cn } from "../lib/utils"
import { truncateAddress } from '../lib/utils'

import { parseUnits, formatUnits, isAddress, getAddress, TransactionExecutionError } from 'viem'
import { useAccount, useBalance, useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'

import { BottomNavigation } from "./bottom-navigation"

// --- ASSET AND CHAIN CONFIGURATION ---
const CHAIN_CONFIG = {
    '1': { name: 'Ethereum', symbol: 'ETH', nativeSymbol: 'ETH', chainId: 1 },
    '10': { name: 'Optimism', symbol: 'OP', nativeSymbol: 'ETH', chainId: 10 },
    '137': { name: 'Polygon', symbol: 'MATIC', nativeSymbol: 'MATIC', chainId: 137 },
    '56': { name: 'BNB Chain', symbol: 'BNB', nativeSymbol: 'BNB', chainId: 56 },
    '42161': { name: 'Arbitrum', symbol: 'ARB', nativeSymbol: 'ETH', chainId: 42161 },
    '8453': { name: 'Base', symbol: 'BASE', nativeSymbol: 'ETH', chainId: 8453 },
}

const ERC20_ABI = [
    { type: 'function', name: 'transfer', inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
    { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
]

const ASSET_CONFIG_BASE = {
    ETH: { name: 'Ethereum', decimals: 18, logo: 'Ξ', color: 'text-blue-400', isNative: true, addresses: { '1': null } },
    BNB: { name: 'BNB', decimals: 18, logo: 'B', color: 'text-yellow-500', isNative: true, addresses: { '56': null } },
    MATIC: { name: 'Polygon', decimals: 18, logo: 'M', color: 'text-purple-500', isNative: true, addresses: { '137': null } },
    ARB: { name: 'Arbitrum', decimals: 18, logo: 'A', color: 'text-blue-500', isNative: true, addresses: { '42161': null } },
    OP: { name: 'Optimism', decimals: 18, logo: '🔴', color: 'text-red-500', isNative: true, addresses: { '10': null } },
    BASE: { name: 'Base', decimals: 18, logo: 'B', color: 'text-blue-600', isNative: true, addresses: { '8453': null } },
    USDT: {
        name: 'Tether USD', decimals: 6, logo: '$', color: 'text-green-500', isNative: false,
        addresses: {
            '1': '0xdAC17F958D2ee5237c95619A80b8b20e0605a96A',
            '137': '0xc2132d05a96860c6d5c06BC2419f4a643d2C88D2',
            '56': '0x55d398326f99059fF775485246999027B3197955',
        }
    },
    USDC: {
        name: 'USD Coin', decimals: 6, logo: '¤', color: 'text-blue-500', isNative: false,
        addresses: {
            '1': '0xA0b86991c6218b36c1d19D4a2e9eb0cE3606eB48',
            '137': '0x3c499c542cE5E3cc0503E878A1eE970d5dFEaF8c',
            '56': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        }
    }
}

const ALL_ASSET_IDS = Object.entries(ASSET_CONFIG_BASE).flatMap(([symbol, config]) => Object.keys(config.addresses).map(chainId => `${symbol}-${chainId}`))

const getAssetConfig = (assetId, currentChainId) => {
    if (!assetId) return null
    const [symbol, configChainIdStr] = assetId.split('-')
    const config = ASSET_CONFIG_BASE[symbol]
    const assetChainConfig = CHAIN_CONFIG[configChainIdStr]
    if (!config || !assetChainConfig) return null
    const isAvailableOnCurrentChain = String(currentChainId) === configChainIdStr
    const tokenAddress = config.addresses[configChainIdStr]
    const displayLabel = config.isNative ? symbol : `${symbol} (${assetChainConfig.name})`
    const tokenAddressOrNull = tokenAddress ? getAddress(tokenAddress) : null
    const wagmiTokenAddress = config.isNative ? undefined : tokenAddressOrNull
    return {
        id: assetId,
        symbol,
        name: config.name,
        decimals: config.decimals,
        logo: config.logo,
        color: config.color,
        isNative: config.isNative,
        chainName: assetChainConfig.name,
        requiredChainId: assetChainConfig.chainId,
        address: tokenAddressOrNull,
        wagmiTokenAddress,
        isAvailableOnCurrentChain,
        displayLabel,
    }
}


// Custom helper component for modal details
const DetailRow = ({ label, value, valueClass = "font-medium" }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-muted/50 last:border-b-0">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("text-right break-all", valueClass)}>{value}</span>
    </div>
);

// --- MAIN SEND PAGE COMPONENT ---
// ------------------------------------

export function SendPage() {
    const { address: senderAddress, isConnected, chain, connector } = useAccount()
    const chainIdStr = String(chain?.id);
    const chainId = chain?.id;
    const { switchChain } = useSwitchChain();

    // Local State
    const [selectedAssetId, setSelectedAssetId] = useState(ALL_ASSET_IDS.find(id => id.endsWith(`-${chainId}`)) || ALL_ASSET_IDS[0]);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(""); // Token amount
    const [amountFocused, setAmountFocused] = useState(false);
    const [usdAmount, setUsdAmount] = useState(""); // USD amount
    const [errors, setErrors] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [simulateError, setSimulateError] = useState(null);
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [broadcastError, setBroadcastError] = useState(null);
    
    // Price State
    const [isUsdInput, setIsUsdInput] = useState(false); // Tracks which input was last used
    const [assetPrice, setAssetPrice] = useState(0);

    // Dynamic configuration based on state
    const selectedAsset = useMemo(() => getAssetConfig(selectedAssetId, chainId), [selectedAssetId, chainId]);

    // --- Price Fetching & Amount Calculation ---

    // Effect 1: Fetch price (only depends on the selected asset)
    useEffect(() => {
        async function fetchPrice() {
            if (!selectedAsset?.symbol) {
                setAssetPrice(0);
                return;
            }
            
            // Handle stablecoins directly
            if (selectedAsset.symbol === 'USDT' || selectedAsset.symbol === 'USDC') {
                setAssetPrice(1);
                return;
            }

            try {
                const cgIdMap = {
                    'ETH': 'ethereum', 'BNB': 'binancecoin', 'MATIC': 'matic-network',
                    'OP': 'optimism', 'ARB': 'arbitrum', 'BASE': 'base-protocol',
                };
                const cgId = cgIdMap[selectedAsset.symbol];
                if (!cgId) {
                    setAssetPrice(0); // Asset not in map
                    return;
                }

                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('CoinGecko fetch failed');
                const data = await res.json();
                const price = data[cgId]?.usd || 0;
                setAssetPrice(price);
            } catch (err) {
                console.error('Failed to fetch price:', err);
                setAssetPrice(0);
            }
        }
        
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [selectedAsset?.symbol]); // Only re-fetch when asset changes

    // Effect 2: Recalculate the *other* amount when price changes
    useEffect(() => {
        if (assetPrice <= 0) return; // Can't calculate

        if (isUsdInput) {
            // User was typing in USD, so recalculate token amount
            const tokenValue = (Number(usdAmount) / assetPrice);
            setAmount(tokenValue > 0 ? tokenValue.toString() : "");
        } else {
            // User was typing in token, so recalculate USD amount
            const usdValue = (Number(amount) * assetPrice).toFixed(2);
            setUsdAmount(Number(usdValue) > 0 ? usdValue : "");
        }
    }, [assetPrice]); // Only runs when price updates

    // Effect 3: Reset amounts when asset changes
    useEffect(() => {
        setAmount("");
        setUsdAmount("");
        setIsUsdInput(false);
        setErrors({});
        setSimulateError(null);
    }, [selectedAssetId]);

    // Handler for Token Amount input
    const handleAmountChange = (e) => {
        const newAmount = e.target.value;
        if (newAmount === "") {
            setAmount("");
            setUsdAmount("");
        } else if (/^[0-9]*\.?[0-9]*$/.test(newAmount)) { // Allow only numbers and one dot
            setAmount(newAmount);
            setIsUsdInput(false); // Flag that token amount was last touched
            if (assetPrice > 0) {
                const usdValue = (Number(newAmount) * assetPrice).toFixed(2);
                setUsdAmount(usdValue);
            } else {
                setUsdAmount("");
            }
        }
    };

    const formattedAmount = useMemo(() => {
        if (!amount) return '';
        try {
            const decimals = selectedAsset?.decimals ?? 6;
            // Format with group separators but keep decimals
            const parts = amount.split('.');
            const intPart = Number(parts[0]).toLocaleString();
            return parts[1] ? `${intPart}.${parts[1]}` : intPart;
        } catch { return amount }
    }, [amount, selectedAsset]);

    // Handler for USD Amount input
    const handleUsdAmountChange = (e) => {
        const newUsdAmount = e.target.value;
        if (newUsdAmount === "") {
            setAmount("");
            setUsdAmount("");
        } else if (/^[0-9]*\.?[0-9]*$/.test(newUsdAmount)) { // Allow only numbers and one dot
            setUsdAmount(newUsdAmount);
            setIsUsdInput(true); // Flag that USD amount was last touched
            if (assetPrice > 0) {
                const tokenValue = (Number(newUsdAmount) / assetPrice);
                setAmount(tokenValue.toString());
            } else {
                setAmount("");
            }
        }
    };

    // computeMaxAmount moved below after balance is fetched to avoid referencing it before initialization
    
    // --- WAGMI: REAL-TIME BALANCE FETCHING ---
    const { data: balanceData } = useBalance({
        address: senderAddress,
        token: selectedAsset?.wagmiTokenAddress,
        chainId: chainId,
        enabled: isConnected && !!senderAddress && !!selectedAsset && selectedAsset.isAvailableOnCurrentChain,
        watch: true,
    })

    const currentBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const currentBalanceDisplay = balanceData ? `${currentBalance.toFixed(4)}` : "0.0000";

    // Compute a safe "max" amount for native transfers (subtract a small gas buffer)
    const computeMaxAmount = useCallback(() => {
        if (!selectedAsset || !selectedAsset.isAvailableOnCurrentChain) return "";
        const balance = currentBalance || 0;
        // If token (ERC-20) just return full balance
        if (!selectedAsset.isNative) {
            // Use the formatted balance from wagmi to preserve precision
            return balanceData?.formatted ?? (balance > 0 ? balance.toString() : "");
        }

        // For native assets, subtract a small gas buffer to avoid OOG when using max
        const GAS_BUFFER = 0.001; // ~0.001 native token (safe small buffer)
        const max = Math.max(0, balance - GAS_BUFFER);
        // Limit decimals for UI friendliness
        const decimals = Math.min(6, selectedAsset.decimals || 6);
        return max > 0 ? max.toFixed(decimals).toString() : "";
    }, [selectedAsset, currentBalance]);

    // --- VALIDATION & PREPARATION LOGIC ---
    const normalizedRecipient = useMemo(() => {
        if (!recipient) return null;
        try { return isAddress(recipient) ? getAddress(recipient) : null; } 
        catch { return null; }
    }, [recipient])

    const isRecipientValid = !!normalizedRecipient;
    const isValidAmount = Number(amount) > 0 && Number(amount) <= currentBalance;
    const isTokenSend = selectedAsset && !selectedAsset.isNative;

    const sendAmountBigInt = useMemo(() => {
        if (!amount || !selectedAsset || Number(amount) <= 0) return BigInt(0);
        try {
            // Use toString() to avoid precision issues with large/small numbers
            return parseUnits(amount.toString(), selectedAsset.decimals);
        } catch (e) {
            console.warn("Failed to parse amount to BigInt:", e);
            return BigInt(0);
        }
    }, [amount, selectedAsset]);

    const isAssetSupportedOnChain = selectedAsset?.isAvailableOnCurrentChain;

    const isPrepareEnabled = isConnected
        && isRecipientValid
        && isValidAmount
        && sendAmountBigInt > BigInt(0)
        && !!selectedAsset
        && isAssetSupportedOnChain; // Must be on the correct chain

    // No prepare hooks are available in the installed wagmi build; construct native request at send time
    // For ERC-20 transfers we'll call writeContractAsync directly
    const currentPrepareError = null;
    const preparedRequest = normalizedRecipient ? { to: normalizedRecipient, value: sendAmountBigInt, chainId } : null;
    const isReadyToSign = isTokenSend ? (isPrepareEnabled && !!selectedAsset?.address) : (isPrepareEnabled && !!preparedRequest);
    const isPreparing = false;

    // --- EFFECT: Handle Simulation Errors ---
    useEffect(() => {
        if (isPrepareEnabled && currentPrepareError) {
            console.error("Prepare Error:", currentPrepareError);
            const msg = (currentPrepareError && currentPrepareError.message) ? currentPrepareError.message : '';
            if (msg.includes("Insufficient") || msg.includes('insufficient')) {
                setSimulateError("Preparation failed: Insufficient funds for gas.");
            } else {
                setSimulateError("Cannot prepare transaction. Check network or token support.");
            }
        } else if (isPrepareEnabled && !isPreparing && !isReadyToSign) {
            // If prepare didn't produce a config (no error but not ready), show generic message
            setSimulateError("Cannot prepare transaction. Check network or token support.");
        } else {
            setSimulateError(null);
        }
    }, [isPrepareEnabled, currentPrepareError, isPreparing, isReadyToSign]);

    // --- WAGMI: TRANSACTION EXECUTION HOOKS ---
    const { sendTransactionAsync } = useSendTransaction();
    const { writeContractAsync } = useWriteContract();

    const {
        data: txReceipt,
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isFailed
    } = useWaitForTransactionReceipt({
        hash: txHash && txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' ? txHash : undefined,
        chainId: chainId,
    });

    // --- TRANSACTION HANDLERS ---
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!recipient) newErrors.recipient = "Recipient address is required";
        else if (!isRecipientValid) newErrors.recipient = "Invalid address format";
        
        if (!amount || Number(amount) <= 0) newErrors.amount = "Amount must be greater than zero";
        else if (!isValidAmount) newErrors.amount = `Insufficient balance (max: ${currentBalanceDisplay} ${selectedAsset?.symbol || ''})`;
        
        if (!selectedAsset) newErrors.asset = "Please select an asset";
        
        // 🎯 NEW: Check preparation status here
        if (isPrepareEnabled && !isReadyToSign && !isPreparing) {
            // If all inputs seem valid but simulation isn't ready, show a general error
            setSimulateError("Cannot prepare transaction. Check network or token support.");
        } else if (simulateError) {
            // If simulation *did* run and failed, that error is already set.
            // We just need to stop the modal.
        }

        setErrors(newErrors);
        
        // Fail validation if there are any input errors OR a simulation error
        return Object.keys(newErrors).length === 0 && !simulateError && isReadyToSign;

    }, [
        recipient, isRecipientValid, 
        amount, isValidAmount, 
        currentBalanceDisplay, selectedAsset, 
        isPrepareEnabled, isReadyToSign, isPreparing, simulateError
    ]);

    // 🎯 THIS FUNCTION NOW RUNS VALIDATION ON CLICK
    const handlePreviewTransaction = () => {
        // validateForm() will set errors in state
        // and only return true if everything is valid.
        if (validateForm()) {
            setShowConfirmModal(true);
        }
    };

    const handleCompleteTransaction = async () => {
        if (!isReadyToSign) return;

        setIsSending(true);
        setTxHash(null); // Clear previous hash

        try {
            let data;
            if (isTokenSend) {
                // Use wagmi writeContractAsync and include the account so the wallet sees "from"
                data = await writeContractAsync({
                    address: selectedAsset?.address,
                    abi: ERC20_ABI,
                    functionName: 'transfer',
                    args: [normalizedRecipient, sendAmountBigInt],
                    account: senderAddress,
                });
            } else {
                // Native transfer via wagmi sendTransactionAsync; include account so provider shows Review correctly
                data = await sendTransactionAsync({
                    to: normalizedRecipient,
                    value: sendAmountBigInt,
                    account: senderAddress,
                });
            }
            // normalize txHash depending on response shape
            if (data?.hash) setTxHash(data.hash);
            else if (typeof data === 'string') setTxHash(data);
            else if (data?.transactionHash) setTxHash(data.transactionHash);
            // we've broadcasted the tx, stop the "awaiting signature" spinner
            setIsSending(false);
        } catch (e) {
            console.error("Transaction broadcast failed or rejected:", e);
            setIsSending(false);
            // Save a trimmed error for UI/debugging
            try {
                // Some error objects contain circular references
                const errJson = JSON.stringify({ message: e?.message, name: e?.name, code: e?.code, data: e?.data || e?.reason || null }, null, 2);
                setBroadcastError(errJson);
            } catch (_) {
                setBroadcastError(String(e));
            }

            if (e instanceof TransactionExecutionError && e.message.includes('User rejected the request')) {
                setTxHash('REJECTED');
            } else {
                setTxHash('BROADCAST_FAILED');
            }
        }
    };

    const handleSwitchChain = () => {
        if (selectedAsset?.requiredChainId && switchChain) {
            switchChain({ chainId: selectedAsset.requiredChainId });
        }
    };
    
    // --- MODAL CONTENT RENDERER ---
    
    const getModalContent = () => {
        const explorerUrl = txHash && txHash !== 'REJECTED' && txHash !== 'BROADCAST_FAILED' ? `${chain?.blockExplorers?.default.url}/tx/${txHash}` : null;

        // --- Status: Sending / Confirming ---
        if (isSending || (txHash && isConfirming)) {
            const statusText = isConfirming ? "Confirming on blockchain..." : "Awaiting wallet signature...";
            return (
                <div className="text-center p-6 space-y-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <h2 className="text-xl font-bold">{statusText}</h2>
                    <p className="text-sm text-muted-foreground break-all">
                        {txHash ? `Hash: ${truncateAddress(txHash)}` : "Please check your wallet to sign the transaction."}
                    </p>
                    {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                            View on {chain?.blockExplorers?.default.name || 'Explorer'}
                        </a>
                    )}
                    <Button onClick={handleModalClose} variant="secondary" disabled={isConfirming} className="w-full mt-4">
                        {isConfirming ? "Close" : "Cancel"}
                    </Button>
                </div>
            );
        }
        
        // --- Status: Success ---
        if (isConfirmed && txReceipt?.status === 'success') {
             return (
                <div className="text-center p-6 space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h2 className="text-xl font-bold">Transaction Successful</h2>
                    <p className="text-sm text-muted-foreground">Your transaction has been confirmed on the blockchain.</p>
                     {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                            View on {chain?.blockExplorers?.default.name || 'Explorer'}
                        </a>
                    )}
                    <Button onClick={handleModalClose} className="w-full mt-4">Done</Button>
                </div>
            );
        }
        
        // --- Status: Failed / Rejected ---
        const isFinalFailure = isFailed || (isConfirmed && txReceipt?.status === 'reverted') || txHash === 'REJECTED' || txHash === 'BROADCAST_FAILED';
        if (isFinalFailure) {
            let title = "Transaction Failed";
            let message = "An unknown error occurred.";
            if (txHash === 'REJECTED') {
                title = "Transaction Rejected";
                message = "You rejected the transaction in your wallet.";
            } else if (txHash === 'BROADCAST_FAILED') {
                title = "Broadcast Failed";
                message = "The transaction failed to broadcast. Please try again.";
            } else if (isConfirmed && txReceipt?.status === 'reverted') {
                title = "Transaction Reverted";
                message = "The transaction was reverted by the blockchain. This can be due to an error in the contract or insufficient gas.";
            }

             return (
                <div className="text-center p-6 space-y-4">
                    <XCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{message}</p>
                    {txHash === 'BROADCAST_FAILED' && broadcastError && (
                        <div className="mt-2 text-xs text-left p-2 bg-muted/10 rounded max-h-32 overflow-auto">
                            <strong className="block">Error details:</strong>
                            <pre className="whitespace-pre-wrap text-[12px]">{broadcastError}</pre>
                        </div>
                    )}
                     {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                            View on {chain?.blockExplorers?.default.name || 'Explorer'}
                        </a>
                    )}
                    <Button onClick={handleModalClose} variant="secondary" className="w-full mt-4">Close</Button>
                </div>
            );
        }
        
        // --- Default: Review Screen ---
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Review Transaction</DialogTitle>
                    <DialogDescription>
                        Please review the details below before sending.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <DetailRow label="You are sending" value={`${amount} ${selectedAsset?.symbol || ''}`} valueClass="font-bold text-lg" />
                    <DetailRow label="USD Value" value={`~ $${usdAmount}`} />
                    <DetailRow label="Recipient" value={truncateAddress(recipient)} />
                    <DetailRow label="Network" value={selectedAsset?.chainName || 'Unknown'} />
                </div>
                <DialogFooter>
                    <Button onClick={handleModalClose} variant="outline">Cancel</Button>
                    <Button onClick={handleCompleteTransaction}>
                        Send
                    </Button>
                </DialogFooter>
            </>
        );
    }
    
    // Helper to reset state when modal closes
    const handleModalClose = () => {
        setShowConfirmModal(false);
        // Reset tx state only after a *final* status (success/fail)
        if ((isConfirmed || isFailed || txHash === 'REJECTED' || txHash === 'BROADCAST_FAILED') && !isConfirming) {
            setTxHash(null);
            setIsSending(false);
            setAmount(""); // Clear form on success
            setUsdAmount("");
            setRecipient("");
        }
    }

    // Auto-close modal on success after short delay and reset form
    useEffect(() => {
        if (isConfirmed && txReceipt?.status === 'success') {
            setIsSending(false);
            const t = setTimeout(() => {
                setShowConfirmModal(false);
                setTxHash(null);
                setAmount("");
                setUsdAmount("");
                setRecipient("");
            }, 2000);
            return () => clearTimeout(t);
        }
        // If failed, ensure sending flag is cleared
        if (isFailed) {
            setIsSending(false);
        }
    }, [isConfirmed, isFailed, txReceipt]);
    
    // --- 🎯 UPDATED ACTION BUTTON RENDERER ---
    
    const renderActionButton = () => {
        // State 1: Not connected
        if (!isConnected) {
            return <Button disabled className="w-full">Connect Wallet to Send</Button>;
        }
        
        // State 2: Connected, but on wrong chain
        if (selectedAsset && !isAssetSupportedOnChain) {
            return <Button onClick={handleSwitchChain} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                <AlertCircle className="mr-2 h-4 w-4" />
                Switch to {selectedAsset.chainName}
            </Button>;
        }
        
        // State 3: Connected, on correct chain, but transaction is in progress
    const isLoading = isPreparing || isSending || isConfirming;
        
        // The button is now ONLY disabled if it's already loading.
        // All validation happens when onClick is fired.
        const isDisabled = isLoading; 
        
        return (
            <Button onClick={handlePreviewTransaction} disabled={isDisabled} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPreparing ? "Checking..." : isSending ? "Check Wallet..." : isConfirming ? "Confirming..." : "Review"}
            </Button>
        );
    }

    // --- THE FULL JSX UI ---

    return (
        <div className="flex flex-col h-screen">
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background">
                <Link href="/dashboard" passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-lg font-semibold">Send Asset</h1>
                <Button variant="ghost" size="icon">
                    <Scan className="h-5 w-5" />
                </Button>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                        {/* --- Asset Selector --- */}
                        <div className="space-y-2">
                            <Label htmlFor="asset">Asset</Label>
                            <Select onValueChange={setSelectedAssetId} value={selectedAssetId}>
                                <SelectTrigger id="asset">
                                    <SelectValue placeholder="Select an asset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_ASSET_IDS.map(assetId => {
                                        const config = getAssetConfig(assetId, chainId);
                                        if (!config) return null;
                                        return (
                                            <SelectItem key={config.id} value={config.id}>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("font-bold", config.color)}>{config.logo}</span>
                                                    <span>{config.displayLabel}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* --- Recipient Input --- */}
                        <div className="space-y-2">
                            <Label htmlFor="recipient">To</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="recipient"
                                    placeholder="Enter address or ENS name"
                                    value={recipient}
                                    onChange={(e) => {
                                        setRecipient(e.target.value);
                                        setErrors(prev => ({ ...prev, recipient: undefined })); // Clear error on change
                                        setSimulateError(null); // Clear sim error
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            {errors.recipient && <p className="text-xs text-destructive">{errors.recipient}</p>}
                        </div>

                        {/* --- Amount Inputs --- */}
                        <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                            {/* Token Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">You Send</Label>
                                <div className="flex items-center justify-between">
                                    <Input
                                        id="amount"
                                        placeholder="0"
                                        type="text"
                                        inputMode="decimal"
                                        value={amountFocused ? amount : formattedAmount}
                                        onFocus={() => setAmountFocused(true)}
                                        onBlur={() => setAmountFocused(false)}
                                        onChange={(e) => {
                                            handleAmountChange(e);
                                            setErrors(prev => ({ ...prev, amount: undefined })); // Clear error on change
                                            setSimulateError(null); // Clear sim error
                                        }}
                                        className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none"
                                    />
                                    <span className="text-xl font-medium text-muted-foreground">{selectedAsset?.symbol || ''}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Balance: {currentBalanceDisplay}</span>
                                    <div className="flex items-center gap-2">
                                        {selectedAsset?.isNative ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const max = computeMaxAmount();
                                                    setAmount(max);
                                                    if (assetPrice > 0) setUsdAmount((Number(max) * assetPrice).toFixed(2));
                                                    setErrors(prev => ({ ...prev, amount: undefined }));
                                                    setSimulateError(null);
                                                }}
                                                className="text-primary text-xs hover:underline"
                                            >
                                                Max
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // For ERC-20 tokens, set full token balance (preserve wagmi formatted value if available)
                                                    const full = balanceData?.formatted ?? (currentBalance > 0 ? currentBalance.toString() : '');
                                                    if (full) {
                                                        setAmount(full.toString());
                                                        if (assetPrice > 0) setUsdAmount((Number(full) * assetPrice).toFixed(2));
                                                        setErrors(prev => ({ ...prev, amount: undefined }));
                                                        setSimulateError(null);
                                                    }
                                                }}
                                                className="text-primary text-xs hover:underline"
                                            >
                                                Max
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                            </div>

                            <hr className="border-t border-border" />

                            {/* USD Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="usd-amount" className="text-muted-foreground">USD Equivalent</Label>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-muted-foreground mr-2">$</span>
                                    <Input
                                        id="usd-amount"
                                        placeholder="0.00"
                                        type="text"
                                        inputMode="decimal"
                                        value={usdAmount}
                                        onChange={(e) => {
                                            handleUsdAmountChange(e);
                                            setErrors(prev => ({ ...prev, amount: undefined })); // Clear error on change
                                            setSimulateError(null); // Clear sim error
                                        }}
                                        className="text-lg font-bold border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none text-right"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- Simulation Error --- */}
                        {simulateError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p className="text-xs">{simulateError}</p>
                            </div>
                        )}

                        {/* --- Debug Panel (hidden by default) --- */}
                        <div className="mt-3 text-xs">
                            <button
                                type="button"
                                onClick={() => setShowDebugPanel(s => !s)}
                                className="text-muted-foreground hover:underline"
                            >
                                {showDebugPanel ? 'Hide debug' : 'Show debug'}
                            </button>
                            {showDebugPanel && (
                                <div className="mt-2 p-3 bg-muted/20 rounded text-xs overflow-auto max-h-48">
                                    <pre className="whitespace-pre-wrap text-[11px] leading-snug">
{(() => {
    try {
        return JSON.stringify({ preparedRequest: preparedRequest || null, prepareError: currentPrepareError || null }, null, 2);
    } catch (e) {
        return String(preparedRequest) || 'No debug data';
    }
})()}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* --- THIS IS THE REAL, WORKING BUTTON --- */}
                        {/* It replaces the fake one you had */}
                        <div className="pt-4">
                            {renderActionButton()}
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* --- Confirmation & Status Modal --- */}
            <Dialog open={showConfirmModal} onOpenChange={handleModalClose}>
                <DialogContent>
                    {getModalContent()}
                </DialogContent>
            </Dialog>

            <BottomNavigation />
        </div>
    )
}
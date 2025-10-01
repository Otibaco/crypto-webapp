"use client";

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query'; 
import { HistoryPage } from "../../components/history-page";
import { Loader2, AlertTriangle } from 'lucide-react';

// Define the chains your app supports. Must match Moralis's string names.// Define the chains your app supports. Must match Moralis's string names.
const SUPPORTED_CHAINS = [
  'eth',        // Ethereum Mainnet (0x1)
  'optimism',   // Optimism (0xa)
  'arbitrum',   // Arbitrum (0xa4b1)
  'polygon',    // Polygon (0x89)
  'bsc',        // Binance Smart Chain (0x38)
  'avalanche',  // Avalanche (0xa86a)
  'fantom',     // Fantom (0xfa)
  'base',       // Base (0x2105)
  'sepolia'     // Sepolia Testnet (0xaa36a7)
];

// 1. Data Fetching Function: Calls the secure local API route
const fetchTransactionHistory = async (address) => {
    if (!address) return [];

    // Call the secure local API route
    const url = `/api/history?address=${address}&chains=${SUPPORTED_CHAINS.join(',')}`;
    
    const response = await fetch(url);

    if (!response.ok) {
        // Attempt to read the detailed JSON error. Fallback for non-JSON or missing error fields.
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch transaction history. Status: ${response.status}.`;
        throw new Error(errorMessage);
    }

    // Returns the array of transactions (either [tx] or [])
    return response.json(); 
};


export default function History() {
    // Get the current user's address and connection status
    const { address, isConnected } = useAccount();

    // 2. Use react-query with professional retry configuration for resilience
    const { data: transactions, isLoading, isError, error } = useQuery({
        queryKey: ['transactionHistory', address],
        queryFn: () => fetchTransactionHistory(address),
        enabled: isConnected && !!address, // Only run if connected and address exists
        initialData: [],
        
        // PROFESSIONAL RESILIENCE: Retry up to 3 times with exponential backoff for transient failures
        retry: 3, 
        retryDelay: attempt => {
            // Delay: 1000ms, 2000ms, 4000ms... up to 30 seconds max
            return Math.min(1000 * 2 ** attempt, 30000); 
        },
    });

    if (!isConnected) {
        return (
            <div className="text-center p-8 space-y-4 rounded-xl bg-card shadow-lg m-4 md:m-8">
                <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500" />
                <h1 className="text-xl font-bold">Wallet Not Connected</h1>
                <p className="text-muted-foreground">Please connect your wallet to view transaction history.</p>
            </div>
        );
    }
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12 space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground font-medium">Loading transaction history...</span>
            </div>
        );
    }

    if (isError) {
        console.error("History Fetch Error:", error);
        return (
            <div className="text-center p-8 space-y-4 rounded-xl bg-red-900/10 border border-red-500/50 m-4 md:m-8">
                <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
                <h1 className="text-xl font-bold text-red-500">Error Loading History</h1>
                <p className="text-sm text-muted-foreground">
                    We encountered an issue fetching your data. This may be a temporary network problem. 
                    <span className="block mt-2 font-medium text-red-400">Details: {error.message}</span>
                </p>
            </div>
        );
    }

    // 3. Render the UI component with the fetched data and the connected address
    return (
        <div className="p-4 md:p-8">
            <HistoryPage initialTransactions={transactions} walletAddress={address} />
        </div>
    );
}

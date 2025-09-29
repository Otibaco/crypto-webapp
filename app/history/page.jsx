"use client";

import { useAccount } from 'wagmi';
// We use react-query for professional data fetching/caching
import { useQuery } from '@tanstack/react-query'; 
import { HistoryPage } from "../../components/history-page";
import { Loader2, AlertTriangle } from 'lucide-react';

// Define the chains your app supports. Must match Moralis's string names.
const SUPPORTED_CHAINS = ['eth', 'polygon', 'bsc', 'arbitrum', 'base']; 

// 1. Data Fetching Function: Calls the secure local API route
const fetchTransactionHistory = async (address) => {
    if (!address) return [];

    // Call the secure local API route
    const url = `/api/history?address=${address}&chains=${SUPPORTED_CHAINS.join(',')}`;
    
    const response = await fetch(url);

    if (!response.ok) {
        // Reads the detailed JSON error from the fixed API route
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transaction history.');
    }

    // Returns the array of transactions (either [tx] or [])
    return response.json(); 
};


export default function History() {
    // Get the current user's address and connection status
    const { address, isConnected } = useAccount();

    // 2. Use react-query to manage the fetching state
    const { data: transactions, isLoading, isError, error } = useQuery({
        queryKey: ['transactionHistory', address],
        queryFn: () => fetchTransactionHistory(address),
        enabled: isConnected && !!address, // Only run if connected and address exists
        // Add a placeholder to prevent 'undefined' in the final render if the data is empty
        initialData: [] 
    });

    if (!isConnected) {
        return (
            <div className="text-center p-8 space-y-4">
                <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500" />
                <h1 className="text-xl font-bold">Wallet Not Connected</h1>
                <p className="text-muted-foreground">Please connect your wallet to view transaction history.</p>
            </div>
        );
    }
    
    // REFINED CHECK: Only show loading if we are actively fetching
    // The use of initialData: [] ensures 'transactions' is always an array when not loading.
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Loading transaction history...</span>
            </div>
        );
    }

    if (isError) {
        console.error("History Fetch Error:", error);
        return (
            <div className="text-center p-8 space-y-4">
                <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
                <h1 className="text-xl font-bold text-red-500">Error Loading History</h1>
                <p className="text-muted-foreground">An error occurred while fetching your history. Details: {error.message}</p>
            </div>
        );
    }

    // 3. Render the UI component with the fetched data and the connected address
    return (
        <div className="p-4 md:p-8">
            {/* If transactions is an empty array, HistoryPage will show "No transactions found" */}
            <HistoryPage initialTransactions={transactions} walletAddress={address} />
        </div>
    );
}

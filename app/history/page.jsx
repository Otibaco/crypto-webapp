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

    // Call the secure local API route created in Step 1
    const url = `/api/history?address=${address}&chains=${SUPPORTED_CHAINS.join(',')}`;
    
    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        // This correctly throws the error message provided by the server
        throw new Error(errorData.error || 'Failed to fetch transaction history.');
    }

    // Returns the array of transactions
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
    
    if (isLoading || !transactions) {
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

    // 3. Render the UI component with the real fetched data and the connected address
    return (
        <div className="p-4 md:p-8">
            <HistoryPage initialTransactions={transactions} walletAddress={address} />
        </div>
    );
}

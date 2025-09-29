// receive/page.jsx
"use client"; // Must be client-side to use the ReceivePage component

import React from 'react';
import { ReceivePage } from "../../components/receive-page"
import { useRouter } from 'next/navigation'; // Hook to handle navigation back

// Next.js passes searchParams to the page component
export default function Receive({ searchParams }) {
  const router = useRouter();

  // 1. Unwrap the dynamic searchParams object
  const params = React.use(searchParams);

  // 2. FIX: Extract walletAddress and chainName from the CORRECT 'params' object
  const walletAddress = params.address || '';
  const chainName = params.chain || 'Ethereum Mainnet';

  const handleClose = () => {
    // Go back to the dashboard/home page
    router.push('/');
  }

  return (
    <ReceivePage
      walletAddress={walletAddress}
      chainName={chainName}
      onClose={handleClose} // Pass a function to handle the back button on ReceivePage
    />
  )
}
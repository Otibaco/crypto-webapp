// receive/page.jsx
"use client"; // Must be client-side to use the ReceivePage component

import { ReceivePage } from "../../components/receive-page"
import { useRouter } from 'next/navigation'; // Hook to handle navigation back

// Next.js passes searchParams to the page component
export default function Receive({ searchParams }) {
  const router = useRouter();

  // 1. Extract walletAddress and chainName from the URL search parameters
  const walletAddress = searchParams.address || '';
  const chainName = searchParams.chain || 'Ethereum Mainnet';

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
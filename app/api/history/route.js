// app/api/history/route.js

import { NextResponse } from 'next/server';

// Get the API key from your environment variables. 
// NOTE: It should NOT have the NEXT_PUBLIC_ prefix for security.
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;

export async function GET(request) {
  // Ensure the API key is set
  if (!MORALIS_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Moralis API Key missing.' }, { status: 500 });
  }
  
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chains = searchParams.get('chains'); // Comma-separated list of chains

  if (!address || !chains) {
    return NextResponse.json({ error: 'Missing wallet address or chain list.' }, { status: 400 });
  }

  try {
    // Construct the Moralis API URL
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/transactions?chain=${chains}&limit=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': MORALIS_API_KEY,
        'Content-Type': 'application/json'
      },
      // Professional feature: Next.js revalidate setting for caching
      next: { revalidate: 30 } // Cache data for 30 seconds
    });

    if (!response.ok) {
        // Handle API errors gracefully
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Moralis API request failed.';
        return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    // Moralis returns an object with a 'result' array. We return just the array.
    return NextResponse.json(data.result); 
    
  } catch (error) {
    console.error('API History Error:', error);
    return NextResponse.json({ error: 'Internal server error while fetching history.' }, { status: 500 });
  }
}
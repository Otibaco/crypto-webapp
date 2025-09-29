import { NextResponse } from 'next/server';

// Get the API key from your environment variables. 
// NOTE: It should NOT have the NEXT_PUBLIC_ prefix for security.
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;

export async function GET(request) {
  // 1. Configuration Check
  if (!MORALIS_API_KEY) {
    return NextResponse.json({ 
      error: 'Server configuration error: Moralis API Key missing. Please set MORALIS_API_KEY.' 
    }, { status: 500 });
  }
  
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chains = searchParams.get('chains'); // Comma-separated list of chains

  // 2. Input Validation
  if (!address || !chains) {
    return NextResponse.json({ 
      error: 'Missing required parameters: wallet address and active chain list are mandatory.' 
    }, { status: 400 });
  }
  
  // Basic address format check for robustness
  if (address.length < 42 || !address.startsWith('0x')) {
    return NextResponse.json({ 
      error: 'Invalid wallet address format.' 
    }, { status: 400 });
  }

  try {
    // 3. Construct and Fetch from Moralis API
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/transactions?chain=${chains}&limit=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': MORALIS_API_KEY,
        'Content-Type': 'application/json'
      },
      // Next.js revalidate setting for caching
      next: { revalidate: 30 } // Cache data for 30 seconds
    });

    if (!response.ok) {
        // --- CRITICAL FIX: Robust Error Handling for Non-JSON Responses ---
        let errorMessage = `Moralis API request failed with HTTP Status: ${response.status}.`;
        
        try {
            // 4. Attempt to read the response body as JSON (expected error format)
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // 5. If JSON parsing fails (i.e., it's HTML/text), generate a generic error.
            if (response.status === 401 || response.status === 403) {
                 errorMessage = 'Authentication Error: Moralis API Key is likely invalid or missing or exceeded limit.';
            } else {
                 errorMessage = `Moralis returned a non-JSON error page (Status: ${response.status}).`;
            }
        }
        
        // Return a clean JSON error response to the client
        return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // 6. Success Case
    const data = await response.json();
    // Moralis returns an object with a 'result' array. We return just the array.
    return NextResponse.json(data.result); 
    
  } catch (error) {
    // 7. Handle Network/Internal Server Errors
    console.error('API History Error (Internal):', error);
    return NextResponse.json({ error: 'Internal server error while processing history request.' }, { status: 500 });
  }
}

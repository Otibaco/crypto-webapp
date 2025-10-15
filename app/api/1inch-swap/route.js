// pages/api/1inch-swap.js or app/api/1inch-swap/route.js

export default async function handler(req, res) {
  if (req.method !== 'GET') { // 1inch swap endpoint is typically a GET, but in a real app, you might use POST/chain
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fromTokenAddress, toTokenAddress, amount, fromAddress, chainId, slippage } = req.query;

  if (!fromTokenAddress || !toTokenAddress || !amount || !fromAddress || !chainId) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  const ONE_INCH_API_KEY = process.env.ONE_INCH_API_KEY; // 🔑

  try {
    const swapUrl = `https://api.1inch.dev/swap/v5.2/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage || 1}`;

    const response = await fetch(swapUrl, {
      headers: {
        'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: '1inch API Swap Error', details: errorData });
    }

    const data = await response.json();
    // This data contains the 'tx' object needed for the wallet to sign and send the transaction
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching 1inch swap data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
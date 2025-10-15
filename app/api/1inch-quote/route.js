// pages/api/1inch-quote.js or app/api/1inch-quote/route.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fromTokenAddress, toTokenAddress, amount, chainId } = req.query;

  if (!fromTokenAddress || !toTokenAddress || !amount || !chainId) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  const ONE_INCH_API_KEY = process.env.ONE_INCH_API_KEY; // 🔑 MUST be in environment variables

  if (!ONE_INCH_API_KEY) {
    return res.status(500).json({ message: 'API key not configured' });
  }

  try {
    const url = `https://api.1inch.dev/swap/v5.2/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
      },
    });

    if (!response.ok) {
        // Handle API errors like insufficient liquidity
        const errorData = await response.json();
        return res.status(response.status).json({ message: '1inch API Error', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching 1inch quote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
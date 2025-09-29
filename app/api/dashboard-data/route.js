import { NextResponse } from 'next/server'
import axios from 'axios'
import { formatUnits } from 'viem'

// Accessing the API key securely from the server environment
// It checks for both NEXT_PUBLIC (though not recommended for server) and MORALIS_API_KEY
// Use a standard .env or process.env configuration for security.
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;

// --- CONFIGURATION CONSTANTS (Moved from component) ---
const SUPPORTED_CHAIN_IDS = [
    '0x1',        // Ethereum Mainnet
    '0xa',        // Optimism Mainnet
    '0xa4b1',     // Arbitrum Mainnet
    '0x89',       // Polygon Mainnet
    '0x38',       // BNB Smart Chain (BSC)
    '0xa86a',     // Avalanche C-Chain (AVAX)
    '0xfa',       // Fantom Opera
    '0x2105',     // Base Mainnet
    '0xaa36a7',   // Sepolia Testnet
]

const CHAIN_ID_TO_NAME = {
    '0x1': 'ETH',
    '0xa': 'OPTIMISM',
    '0xa4b1': 'ARBITRUM',
    '0x89': 'POLYGON',
    '0x38': 'BSC',
    '0xa86a': 'AVALANCHE',
    '0xfa': 'FANTOM',
    '0x2105': 'BASE',
    '0xaa36a7': 'SEPOLIA',
}

// Dummy mapping for logos (colors/styling is handled back on the client)
const ASSET_VISUALS_SYMBOLS = {
    "ETH": { logo: "Ξ" }, "MATIC": { logo: "P" }, "BNB": { logo: "B" },
    "AVAX": { logo: "A" }, "OP": { logo: "O" }, "ARB": { logo: "A" },
    "FTM": { logo: "F" }, "BASE": { logo: "B" }, "USDC": { logo: "$" },
    "USDT": { logo: "$" }, "DAI": { logo: "Ð" }, "WETH": { logo: "Ξ" },
    "SEPOLIAETH": { logo: "S" },
}

/**
 * Next.js Route Handler for fetching multi-chain token balances from Moralis.
 * @param {Request} request The incoming request object.
 * @returns {NextResponse} JSON response containing asset data or error.
 */
export async function GET(request) {
    // 1. Get the wallet address from the URL query parameters
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: "Wallet address is required." }, { status: 400 });
    }

    if (!MORALIS_API_KEY) {
        // Log error on server but provide generic message to client for security
        console.error("MORALIS_API_KEY is not set in environment variables.");
        return NextResponse.json({ error: "Configuration Error: API Key Missing on server." }, { status: 500 });
    }

    const headers = {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
    }

    let allAssets = [];
    let currentTotalUSD = 0;
    let totalValue24hAgo = 0;

    try {
        // 2. Loop through each supported chain to fetch token balances
        for (const chainId of SUPPORTED_CHAIN_IDS) {
            const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens`

            const response = await axios.get(url, {
                headers: headers,
                params: {
                    'chain': chainId,
                    'exclude_spam': true,
                    'exclude_native': false,
                    'limit': 100
                }
            })

            // 3. Process the assets for the current chain
            const chainAssets = response.data.result.map(item => {
                const balanceBigInt = BigInt(item.balance || 0)

                if (balanceBigInt === 0n || item.possible_spam === true) return null

                const formattedBalance = Number(formatUnits(balanceBigInt, item.decimals || 18))

                const priceUSD = item.usdValue || 0
                const assetValue = formattedBalance * priceUSD

                // Calculate 24h change for portfolio aggregation
                const change24h = item.usdPrice24hrPercentChange || 0
                // Price 24h ago = Current Price / (1 + (Change / 100))
                const price24hAgo = priceUSD / (1 + change24h / 100)
                const assetValue24hAgo = (price24hAgo * formattedBalance) || 0

                // Aggregate the totals
                currentTotalUSD += assetValue
                if (priceUSD > 0) {
                    totalValue24hAgo += assetValue24hAgo
                }

                // Individual asset change percentage
                let changePercentage = "0.0%"
                if (item.usdPrice24hrPercentChange) {
                    const change = item.usdPrice24hrPercentChange
                    changePercentage = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
                }

                const symbol = item.symbol || (CHAIN_ID_TO_NAME[chainId] === 'SEPOLIA' ? 'SEPOLIAETH' : CHAIN_ID_TO_NAME[chainId] || 'NATIVE')
                const visuals = ASSET_VISUALS_SYMBOLS[symbol] || { logo: symbol.charAt(0) || 'A' }

                // Return data structure matching the client's needs
                return {
                    symbol: symbol,
                    name: item.name || item.symbol,
                    balance: formattedBalance,
                    price: priceUSD,
                    totalValue: assetValue,
                    change: changePercentage,
                    logo: visuals.logo, // Logo character is sent, but color styling remains client-side
                    chain_name: CHAIN_ID_TO_NAME[chainId] || chainId,
                }
            }).filter(Boolean)

            allAssets = [...allAssets, ...chainAssets]
        }

        // 4. Final total portfolio calculation
        const changeUSD = currentTotalUSD - totalValue24hAgo
        let changePercent = 0
        if (totalValue24hAgo > 0.01) {
            changePercent = (changeUSD / totalValue24hAgo) * 100
        }

        const responseData = {
            data: allAssets.filter(asset => asset.balance > 0),
            totalBalance: currentTotalUSD,
            totalChangeUSD: changeUSD,
            totalChangePercent: changePercent,
        }

        // 5. Return the final processed data
        return NextResponse.json(responseData);

    } catch (err) {
        console.error("Server Error fetching token balances from Moralis:", err.response ? err.response.data : err.message);

        let errorMessage = "Failed to fetch assets. Please check server configuration or try again."
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            errorMessage = "Authentication failed (401/403). Moralis API Key may be invalid."
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

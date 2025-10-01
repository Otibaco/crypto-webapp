import { NextResponse } from 'next/server'
import axios from 'axios'
import { formatUnits } from 'viem'

// Accessing the API key securely from the server environment
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;

// --- CONFIGURATION CONSTANTS ---
const SUPPORTED_CHAIN_IDS = [
    '0x1',// Ethereum Mainnet
    '0xa',// Optimism Mainnet
    '0xa4b1',// Arbitrum Mainnet
    '0x89',// Polygon Mainnet
    '0x38',// BNB Smart Chain (BSC)
    '0xa86a',// Avalanche C-Chain (AVAX)
    '0xfa',// Fantom Opera
    '0x2105', // Base Mainnet
    '0xaa36a7',// Sepolia Testnet
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
        console.error("MORALIS_API_KEY is not set in environment variables.");
        return NextResponse.json({ error: "Configuration Error: API Key Missing on server." }, { status: 500 });
    }

    console.log("Moralis API Key Status: Successfully loaded from environment variable.");

    const headers = {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
    }

    let allAssets = [];
    let currentTotalUSD = 0;
    let totalValue24hAgo = 0;

    try {
        // --- CONCURRENT FETCHING using Promise.all ---

        // 2. Map chain IDs to an array of promises
        const fetchPromises = SUPPORTED_CHAIN_IDS.map(chainId => {
            const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens`

            return axios.get(url, {
                headers: headers,
                params: {
                    'chain': chainId,
                    'exclude_spam': true,
                    'exclude_native': false,
                    'limit': 100
                }
            })
                // Attach the chainId to the successful response for processing later
                .then(response => ({ chainId, data: response.data.result }))
                .catch(error => {
                    const chainName = CHAIN_ID_TO_NAME[chainId] || chainId;

                    if (error.code === 'ENOTFOUND') {
                        console.error(`ERROR: Network/DNS failure for ${chainName}. Domain deep-index.moralis.io could not be resolved.`);
                    } else if (error.response && error.response.status === 401) {
                        console.error(`ERROR: Authentication failure (401) for ${chainName}. Please check Moralis API Key.`);
                    } else {
                        console.warn(`Warning: Failed to fetch tokens for chain ${chainName}. Skipping. Error: ${error.message}`);
                    }

                    return { chainId, data: [] }; // Return empty array to keep data structure consistent
                });
        });

        // 3. Wait for all chain requests to complete concurrently
        const chainResponses = await Promise.all(fetchPromises);


        // 4. Process the data from all chains
        for (const response of chainResponses) {
            const chainId = response.chainId;

            const chainAssets = response.data.map(item => {
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

        // 5. Final total portfolio calculation
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

        // 6. Return the final processed data
        return NextResponse.json(responseData);

    } catch (err) {
        // This catch block handles catastrophic errors not caught by individual promises
        console.error("Server Error: Catastrophic failure outside individual chain fetches.", err);

        let errorMessage = "An unexpected server error occurred. Please try again."
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            errorMessage = "Authentication failed (401/403). Moralis API Key may be invalid."
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

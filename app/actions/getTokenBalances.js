'use server'

import axios from 'axios';
import { formatUnits } from 'viem';

// Configuration
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// Supported networks configuration
const SUPPORTED_CHAINS = [
    { id: '0x1', name: 'ETH', coingeckoId: 'ethereum' },
    { id: '0xaa36a7', name: 'SEPOLIA', coingeckoId: 'ethereum' },
    { id: '0xa4b1', name: 'ARBITRUM', coingeckoId: 'arbitrum-one' },
    { id: '0xa', name: 'OPTIMISM', coingeckoId: 'optimistic-ethereum' },
    { id: '0x2105', name: 'BASE', coingeckoId: 'base' },
    { id: '0x144', name: 'ZKSYNC', coingeckoId: 'zksync' },
    { id: '0xe708', name: 'LINEA', coingeckoId: 'linea' },
    { id: '0x89', name: 'POLYGON', coingeckoId: 'matic-network' },
    { id: '0x38', name: 'BNB', coingeckoId: 'binancecoin' },
];

// Get price data from CoinGecko
async function getCoinGeckoPrices() {
    const ids = SUPPORTED_CHAINS.map(chain => chain.coingeckoId).join(',');
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
                params: {
                    ids: ids,
                    vs_currencies: 'usd',
                    include_24hr_change: true,
                },
                headers: COINGECKO_API_KEY ? {
                    'x-cg-pro-api-key': COINGECKO_API_KEY
                } : {}
            }
        );
        return response.data;
    } catch (error) {
        console.error('CoinGecko API Error:', error);
        return {};
    }
}

// Format balance data with prices
function formatBalanceData(chainData, prices, chainId) {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    if (!chain) return null;

    const priceData = prices[chain.coingeckoId] || { usd: 0, usd_24h_change: 0 };
    
    // Get balance in proper format
    const balanceBigInt = BigInt(chainData.balance || 0);
    const formattedBalance = Number(formatUnits(balanceBigInt, 18)); // Most native tokens use 18 decimals

    const price = priceData.usd || 0;
    const totalValue = formattedBalance * price;
    const change24h = priceData.usd_24h_change || 0;

    return {
        symbol: chain.name,
        name: chain.name,
        balance: formattedBalance,
        price: price,
        totalValue: totalValue,
        change: `${change24h.toFixed(2)}%`,
        chain_name: chain.name,
        logo: chain.name.charAt(0),
    };
}

// Main function to get token balances
export async function getTokenBalances(address) {
    // Fetch prices first
    const prices = await getCoinGeckoPrices();

    // If Moralis key is missing, return zero entries for all supported chains
    if (!MORALIS_API_KEY) {
        console.warn('Moralis API key missing — returning zero balances for all supported chains.');
        const zeros = SUPPORTED_CHAINS.map(chain => formatBalanceData({ balance: '0' }, prices, chain.id));
        return {
            data: zeros,
            totalBalance: 0,
            totalChangeUSD: 0,
            totalChangePercent: 0,
        };
    }

    // Prepare headers for Moralis
    const headers = {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
    };

    // Fetch balances for all chains concurrently
    const chainPromises = SUPPORTED_CHAINS.map(async chain => {
        try {
            const response = await axios.get(
                `https://deep-index.moralis.io/api/v2.2/${address}/balance`,
                {
                    headers,
                    params: {
                        chain: chain.id,
                    }
                }
            );

            return formatBalanceData(response.data, prices, chain.id);
        } catch (error) {
            // If auth or rate limit error, log and return zero for that chain instead of failing whole request
            const status = error?.response?.status;
            if (status === 401) {
                console.error(`Authentication failure (401) for ${chain.name}. Returning zero balance for this chain.`);
            } else if (status === 429) {
                console.error(`Rate limit hit (429) for ${chain.name}. Returning zero balance for this chain.`);
            } else {
                console.error(`Error fetching ${chain.name} balance:`, error?.message || error);
            }

            return formatBalanceData({ balance: '0' }, prices, chain.id);
        }
    });

    const results = await Promise.all(chainPromises);
    const validResults = results.filter(Boolean);

    // Calculate totals
    const totalBalance = validResults.reduce((sum, asset) => sum + (asset.totalValue || 0), 0);
    const totalChange24h = validResults.reduce((sum, asset) => {
        // asset.change is a string like '+1.23%'
        const changePercent = parseFloat((asset.change || '').replace('%', '')) || 0;
        return sum + ((asset.totalValue || 0) * changePercent / 100);
    }, 0);

    const totalChangePercent = totalBalance > 0
        ? (totalChange24h / totalBalance) * 100
        : 0;

    return {
        data: validResults,
        totalBalance,
        totalChangeUSD: totalChange24h,
        totalChangePercent,
    };
}
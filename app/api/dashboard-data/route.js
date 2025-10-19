import { NextResponse } from 'next/server'
import axios from 'axios'
import { formatUnits } from 'viem'

// Accessing the API key securely from the server environment
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || process.env.MORALIS_API_KEY;

// API Keys
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// Simple in-memory cache
const priceCache = {
  symbols: new Map(),
  contracts: new Map(),
  lastUpdate: 0
};

const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Sleep function to respect rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limit delay
const RATE_LIMIT_DELAY = 1100; // 1.1 seconds between requests

function getCachedPrice(key, type = 'symbols') {
  const cache = type === 'symbols' ? priceCache.symbols : priceCache.contracts;
  const now = Date.now();

  if (now - priceCache.lastUpdate > CACHE_DURATION) {
    cache.clear();
    return null;
  }

  return cache.get(key);
}

// --- CONFIGURATION CONSTANTS ---
const SUPPORTED_CHAIN_IDS = [
  '0x1',// Ethereum Mainnet
  '0xa',// Optimism Mainnet
  '0xa4b1',// Arbitrum Mainnet
  '0x89',// Polygon Mainnet
  '0x38',// BNB (BNB Chain)
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
  '0x38': 'BNB',
  '0xa86a': 'AVALANCHE',
  '0xfa': 'FANTOM',
  '0x2105': 'BASE',
  '0xaa36a7': 'SEPOLIA',
}

const ASSET_VISUALS_SYMBOLS = {
  "ETH": { logo: "/ethereum-eth-logo.png" },
  "MATIC": { logo: "/polygon-matic-logo.png" },
  "BNB": { logo: "/bnb-bnb-logo.png" },
  "AVAX": { logo: "/avalanche-avax-logo.png" },
  "OP": { logo: "/optimism-ethereum-op-logo.png" },
  "ARB": { logo: "/arbitrum-arb-logo.png" },
  "FTM": { logo: "/fantom-ftm-logo.png" },
  "BASE": { logo: "/base-logo.png" },
  "USDC": { logo: "/usd-coin-usdc-logo.png" },
  "USDT": { logo: "/tether-usdt-logo.png" },
  "DAI": { logo: "/dai-dai-logo.png" },
  "WETH": { logo: "/icons/weth.svg" },
  "SEPOLIAETH": { logo: "/icons/eth.svg" },  // Use ETH icon for Sepolia ETH
}

// CoinGecko symbol -> primary id map for quick lookups
const COINGECKO_SYMBOL_MAP = {
  ETH: 'ethereum',
  SEPOLIAETH: 'ethereum',
  ARB: 'arbitrum',
  OP: 'optimism',  // Updated ID
  BASE: 'base',    // Updated ID
  MATIC: 'polygon',
  POL: 'polygon',  // Polygon token
  BNB: 'binancecoin',
  AVAX: 'avalanche-2',
  FTM: 'fantom',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  WETH: 'weth',
  // Add common wrapped versions
  WMATIC: 'wmatic',
  WBNB: 'wbnb',
  WAVAX: 'wrapped-avax',
  WFTM: 'wrapped-fantom'
}

// Aliases for CoinGecko ids when one id may be returned under different names (fallbacks)
const COINGECKO_ALIASES = {
  // MATIC historically appears as both 'polygon' and 'matic-network' in some responses/clients
  MATIC: ['polygon', 'matic-network'],
  POL: ['polygon', 'matic-network']
}

// Map chainId to CoinGecko platform identifiers for contract queries
const CHAIN_PLATFORM_MAP = {
  '0x1': 'ethereum',
  '0x38': 'binance-smart-chain',
  '0x89': 'polygon-pos',
  '0xa86a': 'avalanche',
  '0xfa': 'fantom',
  '0xa4b1': 'arbitrum-one',
  '0xa': 'optimistic-ethereum',
  '0x2105': 'base',
  '0x144': 'zksync'
}

/**
 * Next.js Route Handler for fetching multi-chain token balances from Moralis.
 * @param {Request} request The incoming request object.
 * @returns {NextResponse} JSON response containing asset data or error.
 */
export async function GET(request) {
  try {
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
      'X-API-Key': MORALIS_API_KEY.trim()
    };
    
    let allAssets = [];
    let currentTotalUSD = 0;
    let totalValue24hAgo = 0;

    // --- CONCURRENT FETCHING using Promise.all ---
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
        .then(response => ({ chainId, data: response.data.result || response.data }))
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


    // 4. Always include all 9 supported native tokens, using Moralis data if available, else default to zero balance
    const nativeTokens = [
      { chainId: '0x1', symbol: 'ETH' },
      { chainId: '0x38', symbol: 'BNB' },
      { chainId: '0x89', symbol: 'MATIC' },
      { chainId: '0xa86a', symbol: 'AVAX' },
      { chainId: '0xfa', symbol: 'FTM' },
      { chainId: '0xa', symbol: 'OP' },
      { chainId: '0xa4b1', symbol: 'ARB' },
      { chainId: '0x2105', symbol: 'BASE' },
    ];

    for (const { chainId, symbol } of nativeTokens) {
      // Find Moralis data for this chain's native token
      let moralisAsset = null;
      for (const response of chainResponses) {
        if (response.chainId === chainId && Array.isArray(response.data)) {
          moralisAsset = response.data.find(item => (item.symbol === symbol || (symbol === 'SEPOLIAETH' && item.symbol === 'ETH')));
          break;
        }
      }
      let balance = 0;
      let name = symbol;
      let token_address = null;
      if (moralisAsset) {
        try {
          // Use BigInt only if value exists, otherwise default to zero
          const rawBalance = moralisAsset.balance || moralisAsset.value || 0;
          balance = Number(formatUnits(BigInt(rawBalance || 0), moralisAsset.decimals || 18));
        } catch (e) {
          // If formatUnits fails, fallback to numeric parse
          balance = Number(moralisAsset.balance || 0);
        }
        name = moralisAsset.name || moralisAsset.symbol || name;
        token_address = moralisAsset.token_address || moralisAsset.contract_address || null;
      }
      const visuals = ASSET_VISUALS_SYMBOLS[symbol] || { logo: symbol.charAt(0) || 'A' };
      let iconUrl = visuals.logo;
      if (typeof iconUrl !== 'string' || !iconUrl.startsWith('/')) {
        iconUrl = '/fallback-crypto-icon.png';
      }
      allAssets.push({
        symbol,
        name,
        balance,
        price: 0, // will be filled by CoinGecko
        totalValue: 0,
        change: '0.00%',
        logo: visuals.logo,
        iconUrl,
        chain_name: CHAIN_ID_TO_NAME[chainId] || chainId,
        chain_id: chainId,
        token_address
      });
    }

    // Price lookups (symbols -> CoinGecko ids)
    console.log('Starting price lookups...');
    const nativeSymbols = ['ETH', 'BNB', 'MATIC', 'AVAX', 'FTM', 'OP', 'ARB', 'BASE', 'SEPOLIAETH'];
    const symbolsToFetch = new Set();
    // Add all native token CoinGecko IDs
    for (const sym of nativeSymbols) {
      const cgId = COINGECKO_SYMBOL_MAP[sym];
      if (cgId) {
        symbolsToFetch.add(cgId);
      }
    }
    // Add any other tokens from assets that need price
    for (const a of allAssets) {
      if ((!a.price || a.price === 0) && a.symbol) {
        const cgId = COINGECKO_SYMBOL_MAP[a.symbol];
        if (cgId) {
          symbolsToFetch.add(cgId);
          console.log(`Will fetch price for ${a.symbol} using CoinGecko ID: ${cgId}`);
        } else {
          console.log(`No CoinGecko mapping found for symbol: ${a.symbol}`);
        }
      }
    }

    if (symbolsToFetch.size > 0) {
      const ids = Array.from(symbolsToFetch).join(',')
      console.log('Fetching CoinGecko prices for symbols:', Array.from(symbolsToFetch));
      let priceData = {};

      try {
        // Check cache first
        const cachedData = getCachedPrice(ids, 'symbols');
        if (cachedData) {
          priceData = cachedData;
        } else {
          await sleep(RATE_LIMIT_DELAY);
          const cgRes = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
              params: {
                ids,
                vs_currencies: 'usd',
                include_24hr_change: true
              }
            }
          );
          priceData = cgRes.data || {};
          // Debug log for polygon (MATIC)
          if (priceData['polygon']) {
            console.log('CoinGecko price for polygon (MATIC):', priceData['polygon']);
          }
          // Update cache
          priceCache.symbols.set(ids, priceData);
          priceCache.lastUpdate = Date.now();
        }
      } catch (error) {
        console.warn('CoinGecko API error:', error.message);
        // Try to use cached data even if expired
        const cachedData = priceCache.symbols.get(ids);
        if (cachedData) {
          priceData = cachedData;
          console.log('Using expired cache data due to API error');
        }
      }

      for (const asset of allAssets) {
        const primaryId = COINGECKO_SYMBOL_MAP[asset.symbol];
        let entry = null;

        // Try primary id first
        if (primaryId && priceData[primaryId]) {
          entry = priceData[primaryId];
        }

        // Fallback to aliases (e.g., 'matic-network') if primary missing
        if (!entry && COINGECKO_ALIASES[asset.symbol]) {
          for (const altId of COINGECKO_ALIASES[asset.symbol]) {
            if (priceData[altId]) {
              entry = priceData[altId];
              console.log(`Using alias CoinGecko id '${altId}' for symbol ${asset.symbol}`);
              break;
            }
          }
        }

        if (entry) {
          const p = entry.usd || 0;
          const ch = typeof entry.usd_24h_change === 'number' ? entry.usd_24h_change : 0;
          asset.price = p;
          asset.totalValue = (asset.balance || 0) * p;
          asset.change = `${ch > 0 ? '+' : ''}${ch.toFixed(2)}%`;
        }
      }
    }

    // Second: contract-address-based CoinGecko lookup per platform for remaining missing prices
    try {
      // Build platform -> [contractAddress]
      const platformMap = {};
      for (const a of allAssets) {
        if ((!a.price || a.price === 0) && a.token_address && a.chain_id) {
          const platform = CHAIN_PLATFORM_MAP[a.chain_id];
          if (platform) {
            platformMap[platform] = platformMap[platform] || new Set();
            platformMap[platform].add(a.token_address.toLowerCase());
          }
        }
      }

      console.log('Platform map for contract lookups:', platformMap);

      for (const [platform, addrSet] of Object.entries(platformMap)) {
        if (!platform) {
          console.warn('Skipping undefined platform');
          continue;
        }
        const addrs = Array.from(addrSet);
        if (addrs.length === 0) continue;

        console.log(`Fetching prices for platform ${platform} with ${addrs.length} contracts`);

        const cacheKey = `${platform}-${addrs.join(',')}`;
        let byAddr = {};

        try {
          // Check cache first
          const cachedData = getCachedPrice(cacheKey, 'contracts');
          if (cachedData) {
            byAddr = cachedData;
            console.log('Using cached contract price data');
          } else {
            await sleep(RATE_LIMIT_DELAY);
            const resp = await axios.get(
              `https://api.coingecko.com/api/v3/simple/token_price/${platform}`,
              {
                params: {
                  contract_addresses: addrs.join(','),
                  vs_currencies: 'usd',
                  include_24hr_change: true
                }
              }
            );
            byAddr = resp.data || {};

            // Update cache
            priceCache.contracts.set(cacheKey, byAddr);
            priceCache.lastUpdate = Date.now();
          }
        } catch (error) {
          console.warn('CoinGecko contract API error:', error.message);
          // Try to use cached data even if expired
          const cachedData = priceCache.contracts.get(cacheKey);
          if (cachedData) {
            byAddr = cachedData;
            console.log('Using expired cache data due to API error');
          }
        }

        // Update prices for matching tokens
        for (const asset of allAssets) {
          if ((!asset.price || asset.price === 0) && asset.token_address && asset.chain_id) {
            const plat = CHAIN_PLATFORM_MAP[asset.chain_id];
            if (!plat) continue;
            const info = byAddr[asset.token_address.toLowerCase()];
            if (info && typeof info.usd === 'number') {
              const p = info.usd;
              const ch = typeof info.usd_24h_change === 'number' ? info.usd_24h_change : 0;
              asset.price = p;
              asset.totalValue = (asset.balance || 0) * p;
              asset.change = `${ch > 0 ? '+' : ''}${ch.toFixed(2)}%`;
            }
          }
        }
      }
    } catch (cgContractErr) {
      console.warn('CoinGecko contract lookup failed:', cgContractErr?.message || cgContractErr);
    }

    // Recompute totals from final asset values
    let finalTotal = 0;
    let finalValue24hAgo = 0;
    for (const asset of allAssets) {
      const tv = asset.totalValue || 0;
      finalTotal += tv;

      const changeStr = (asset.change || '').toString().replace('%', '');
      const changeNum = parseFloat(changeStr) || 0;
      if (asset.price && asset.price > 0) {
        const denom = (1 + changeNum / 100) || 1;
        const price24hAgo = asset.price / denom;
        finalValue24hAgo += (asset.balance || 0) * price24hAgo;
      }
    }

    const changeUSD = finalTotal - finalValue24hAgo;
    let changePercent = 0;
    if (finalValue24hAgo > 0.01) {
      changePercent = (changeUSD / finalValue24hAgo) * 100;
    }

    const responseData = {
      data: allAssets,
      totalBalance: finalTotal,
      totalChangeUSD: changeUSD,
      totalChangePercent: changePercent,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    // This catch block handles catastrophic errors not caught by individual promises
    console.error("Server Error: Catastrophic failure outside individual chain fetches.", err);

    let errorMessage = "An unexpected server error occurred. Please try again.";
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      errorMessage = "Authentication failed (401/403). Moralis API Key may be invalid.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

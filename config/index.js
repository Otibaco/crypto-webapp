// wagmi.config.js

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  mainnet,
  sepolia,
  polygon,
  bsc,
  arbitrum,
  optimism,
  base,
  zksync,
  linea,
} from '@reown/appkit/networks'

// ✅ Your Reown project ID
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// ✅ Supported networks
export const networks = [
  mainnet,    // Ethereum Mainnet
  sepolia,    // Testnet
  arbitrum,   // L2
  optimism,   // L2
  base,       // Coinbase L2
  zksync,     // zk-Rollup
  linea,      // ConsenSys zkEVM
  polygon,    // Sidechain
  bsc,        // Binance Smart Chain
]

// ✅ Initialize wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
})

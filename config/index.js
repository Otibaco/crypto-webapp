// wagmi.config.ts or config/wagmi.ts

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

// ✅ Project ID (from Reown Dashboard)
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// ✅ Focus on Ethereum + top Layer 2 + major sidechains
export const networks = [
  mainnet,   // Ethereum Mainnet
  sepolia,   // Testnet
  arbitrum,  // L2
  optimism,  // L2
  base,      // Coinbase L2
  zksync,    // zk-rollup
  linea,     // ConsenSys L2
  polygon,   // Sidechain
  bsc,       // Binance Smart Chain
]

// ✅ Modular architecture for EVM networks
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
})

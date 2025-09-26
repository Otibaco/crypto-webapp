import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// We are providing a curated list of only Ethereum networks (Mainnet and Sepolia Testnet).
// This eliminates the "Select Chain" prompt for EVM wallets like MetaMask.
export const networks = [mainnet, sepolia];

// Set up the Wagmi Adapter for EVM networks.
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

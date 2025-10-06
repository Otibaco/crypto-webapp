'use client'

import { wagmiAdapter, projectId, networks } from '../config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: '2sweet',
  description: 'Ethereum based dApp',
  url: 'https://crypto-webapp-phi.vercel.app',  
  // url: 'http://localhost:3000',
  icons: ['/logo.png']
}

// Create the modal
export const modal = createAppKit({
  // We no longer include the Solana adapter here to simplify the connection process.
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    // === BRAND COLORS (from your Tailwind theme) ===
    '--w3m-accent': 'oklch(0.7 0.25 280)', // Primary (purple)
    '--w3m-background': 'oklch(0.08 0 0)', // Dark background
    '--w3m-color': 'oklch(0.98 0 0)', // Text/foreground (white)
    '--w3m-border-radius-master': '1rem', // Match your --radius

    // === OPTIONAL CUSTOMIZATIONS ===
    '--w3m-button-border-radius': '1rem',
    '--w3m-font-family': 'var(--font-geist-sans)',

    // Hover/secondary accents using your neon gradients
    '--w3m-accent-fill-color': 'linear-gradient(135deg, oklch(0.7 0.25 280) 0%, oklch(0.65 0.25 240) 100%)',
    '--w3m-background-border-color': 'oklch(0.2 0 0)',
    '--w3m-secondary-button-background': 'oklch(0.15 0 0)',
    '--w3m-secondary-button-hover-background': 'oklch(0.6 0.25 180)',

    // Neon glow style
    '--w3m-accent-glow': '0 0 20px oklch(0.7 0.25 280 / 0.3)',

    // === Chart & Ring (for visual consistency) ===
    '--w3m-ring-color': 'oklch(0.7 0.25 280)',
    '--w3m-success-color': 'oklch(0.65 0.25 120)', // green-cyan success
    '--w3m-error-color': 'oklch(0.6 0.25 0)',
  },
})

export default function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

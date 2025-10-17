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
     "--w3m-color-mix": "#22c55e",
    "--w3m-accent": "#22c55e",
    "--w3m-font-family": "Inter, sans-serif",
    "--w3m-button-border-radius": "0.75rem",
    "--w3m-z-index": "9999",
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

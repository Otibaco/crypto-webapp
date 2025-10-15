import { Card, CardContent } from "../components/ui/card"

const coins = [
   { name: "Ethereum", symbol: "ETH", description: "The world's programmable blockchain and main EVM gas coin" },
  { name: "BNB", symbol: "BNB", description: "The native coin for the BNB Chain" },
  { name: "Polygon", symbol: "MATIC", description: "Native token of the Polygon ecosystem" },
  { name: "Avalanche", symbol: "AVAX", description: "Native coin for the Avalanche C-Chain" },
  { name: "Fantom", symbol: "FTM", description: "The native coin for the Fantom network" },

  // Layer 2 / Ecosystem Tokens
  { name: "Arbitrum", symbol: "ARB", description: "Governance token for the Arbitrum L2 ecosystem" },
  { name: "Optimism", symbol: "OP", description: "Governance token for the Optimism L2 ecosystem" },
  { name: "Gnosis", symbol: "GNO", description: "The native coin for Gnosis Chain" },
  { name: "Solana", symbol: "SOL", description: "Native coin for the Solana blockchain (Often bridged to EVM DApps)" },

  // Stablecoins (Ethereum EVM Based)
  { name: "Tether", symbol: "USDT", description: "Centralized stable digital dollar (ERC-20)" },
  { name: "USD Coin", symbol: "USDC", description: "Centralized stable digital dollar (ERC-20)" },
]

export function SupportedCoins() {
  return (
    <section className="py-32 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">
            Supported <span className="gradient-text">Tokens</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Trade popular ERC-20 tokens on Ethereum with instant on-chain swaps
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {coins.map((coin, index) => (
            <Card
              key={index}
              className="crypto-card text-center p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-105 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{coin.symbol.slice(0, 2)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{coin.name}</h3>
                <p className="text-sm text-muted-foreground font-mono mb-2">{coin.symbol}</p>
                <p className="text-xs text-muted-foreground">{coin.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            And <span className="text-primary font-bold">500+ more</span> ERC-20 tokens available for trading
          </p>
        </div>
      </div>
    </section>
  )
}

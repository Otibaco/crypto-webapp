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
    // Adjusted vertical padding
    <section className="py-20 lg:py-32 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          {/* Responsive Heading Size */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 glow-text text-balance">
            Supported <span className="gradient-text">Tokens</span>
          </h2>
          {/* Responsive Paragraph Size and Width */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Trade popular ERC-20 tokens on Ethereum with instant on-chain swaps
          </p>
        </div>

        {/* Tighter Grid: 2-col on mobile, 3-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {coins.map((coin, index) => (
            <Card
              key={index}
              className="crypto-card text-center p-4 sm:p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 h-full"
            >
              <CardContent className="pt-4 sm:pt-6">
                {/* Icon size adjusted for mobile */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{coin.symbol.slice(0, 2)}</span>
                </div>
                {/* Text sizes adjusted for mobile */}
                <h3 className="text-lg sm:text-xl font-bold mb-1">{coin.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mb-1 sm:mb-2">{coin.symbol}</p>
                {/* Description text size reduced */}
                <p className="text-xs text-muted-foreground text-balance max-w-prose mx-auto">{coin.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10 lg:mt-12">
          {/* Paragraph size adjusted */}
          <p className="text-base md:text-lg text-muted-foreground">
            And <span className="text-primary font-bold">500+ more</span> ERC-20 tokens available for trading
          </p>
        </div>
      </div>
    </section>
  )
}
import { Navigation } from "../../components/navigation"
import  Footer  from "../../components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ArrowDownUp, Info, Settings, Zap, Shield, Clock } from "lucide-react"

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 glow-text">
              Swap Tokens <span className="gradient-text">Instantly</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              Swap tokens instantly on Ethereum — secured by smart contracts and transparent blockchain technology.
              Non-custodial, decentralized, and fully under your control.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Swap Interface */}
            <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm sticky top-24">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <ArrowDownUp className="w-6 h-6 text-primary" />
                  Token Swap
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Settings className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* From Token */}
                <div className="space-y-3">
                  <Label className="text-lg flex items-center justify-between">
                    <span>From</span>
                    <span className="text-sm text-muted-foreground">Balance: 0.00</span>
                  </Label>
                  <div className="flex gap-3">
                    <Input placeholder="0.0" className="text-2xl p-6 flex-1" />
                    <Button variant="outline" className="px-6 text-lg font-semibold bg-transparent">
                      ETH
                    </Button>
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2">
                  <Button variant="ghost" size="sm" className="rounded-full p-3 bg-card border-2 border-border">
                    <ArrowDownUp className="w-5 h-5" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-3">
                  <Label className="text-lg flex items-center justify-between">
                    <span>To</span>
                    <span className="text-sm text-muted-foreground">Balance: 0.00</span>
                  </Label>
                  <div className="flex gap-3">
                    <Input placeholder="0.0" className="text-2xl p-6 flex-1" />
                    <Button variant="outline" className="px-6 text-lg font-semibold bg-transparent">
                      USDC
                    </Button>
                  </div>
                </div>

                {/* Swap Details */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Rate
                      <Info className="w-4 h-4" />
                    </span>
                    <span className="font-medium">1 ETH = 2,450 USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Gas Fee
                      <Info className="w-4 h-4" />
                    </span>
                    <span className="font-medium">~$5.20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Slippage Tolerance
                      <Info className="w-4 h-4" />
                    </span>
                    <span className="font-medium">0.5%</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-xl py-6 mt-6">
                  Connect Wallet to Swap
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>

            {/* Features & Info */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <Card className="crypto-card p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Non-Custodial</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You keep full control of your funds. Your keys, your crypto. We never hold or have access to
                        your assets.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="crypto-card p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Zap className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Instant Swaps</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Powered by Ethereum smart contracts for instant, transparent, and secure token exchanges with
                        on-chain confirmation.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="crypto-card p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Clock className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Best Rates</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our smart routing finds the best exchange rates across multiple liquidity sources to maximize
                        your returns.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Understanding Gas Fees */}
              <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  Understanding Gas Fees
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gas fees are transaction costs paid to Ethereum network validators. They vary based on network
                  congestion and transaction complexity.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Fees are paid in ETH and go directly to network validators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Higher gas = faster transaction confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We display estimated fees before you confirm</span>
                  </li>
                </ul>
              </Card>

              {/* Understanding Slippage */}
              <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-accent/5 to-secondary/5 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-accent" />
                  What is Slippage?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Slippage is the difference between the expected price and the actual execution price of your swap.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Set your tolerance to control maximum price movement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Lower slippage = more protection, but may fail in volatile markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Recommended: 0.5% for stablecoins, 1-2% for volatile tokens</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Wallets */}
      <section className="py-32 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">Supported Wallets</h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 text-pretty">
            Connect with your favorite Ethereum wallet to start swapping
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="crypto-card p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">🦊</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">MetaMask</h3>
              <p className="text-muted-foreground">Most popular Ethereum wallet</p>
            </Card>

            <Card className="crypto-card p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Trust Wallet</h3>
              <p className="text-muted-foreground">Secure mobile-first wallet</p>
            </Card>

            <Card className="crypto-card p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">WalletConnect</h3>
              <p className="text-muted-foreground">Connect any wallet securely</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

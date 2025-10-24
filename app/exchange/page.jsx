import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ArrowDownUp, Info, Settings, Zap, Shield, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-10 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            {/* Responsive Heading Size */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 glow-text text-balance">
              Swap Tokens <span className="gradient-text">Instantly</span>
            </h1>
            {/* Responsive Paragraph Size and Width */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-normal text-pretty">
              Swap tokens instantly on Ethereum — secured by smart contracts and transparent blockchain technology.
              Non-custodial, decentralized, and fully under your control.
            </p>
          </div>

          {/* Main Content Grid: Stacks on mobile, splits on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Swap Interface - Sticky only on large screens */}
            <Card className="crypto-card p-4 sm:p-6 lg:p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm lg:sticky lg:top-24 order-1">
              <CardHeader className="flex flex-row items-center justify-between pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <ArrowDownUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Token Swap
                </CardTitle>
                <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5">

                {/* From Token */}
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg flex items-center justify-between">
                    <span>From</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">Balance: 0.00</span>
                  </Label>
                  <div className="flex gap-3">
                    {/* Input size adjusted */}
                    <Input placeholder="0.0" className="text-xl sm:text-2xl p-4 sm:p-6 flex-1" />
                    {/* Button size adjusted */}
                    <Button variant="outline" className="px-4 sm:px-6 text-base sm:text-lg font-semibold bg-transparent">
                      ETH
                    </Button>
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-1 sm:-my-2">
                  {/* Button size adjusted */}
                  <Button variant="ghost" size="icon" className="rounded-full p-2 sm:p-3 bg-card border-2 border-border w-8 h-8 sm:w-10 sm:h-10">
                    <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg flex items-center justify-between">
                    <span>To</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">Balance: 0.00</span>
                  </Label>
                  <div className="flex gap-3">
                    {/* Input size adjusted */}
                    <Input placeholder="0.0" className="text-xl sm:text-2xl p-4 sm:p-6 flex-1" />
                    {/* Button size adjusted */}
                    <Button variant="outline" className="px-4 sm:px-6 text-base sm:text-lg font-semibold bg-transparent">
                      USDC
                    </Button>
                  </div>
                </div>

                {/* Swap Details - Smaller text on mobile */}
                <div className="space-y-2 pt-3 sm:pt-4 border-t border-border">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Rate
                      <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <span className="font-medium">1 ETH = 2,450 USDC</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Gas Fee
                      <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <span className="font-medium">~$5.20</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Slippage Tolerance
                      <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <span className="font-medium">0.5%</span>
                  </div>
                </div>

                {/* Button size adjusted */}
                <Link href="/connect" >
                  <Button size="lg" className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-12 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    Connect Wallet to Swap
                  </Button>
                </Link>


                <p className="text-xs text-center text-muted-foreground pt-1">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>

            {/* Features & Info - Order 2 on mobile, next to swap on desktop */}
            <div className="space-y-6 sm:space-y-8 order-2">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">

                {/* Feature 1 */}
                <Card className="crypto-card p-4 sm:p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-4 sm:pt-6 flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="hidden w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      <Image src="/server.png" alt="Non-Custodial" width={40} height={40} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 size-16" />

                    </div>
                    <div>
                      {/* Responsive Heading Size */}
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Non-Custodial</h3>
                      {/* Responsive Text Size */}
                      <p className="text-sm text-muted-foreground leading-normal">
                        You keep full control of your funds. Your keys, your crypto. We never hold or have access to
                        your assets.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature 2 */}
                <Card className="crypto-card p-4 sm:p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-4 sm:pt-6 flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-accent/10 flex-shrink-0">
                      <Zap className="hidden w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                      <Image src="/instant.png" alt="Instant-Swaps" width={40} height={40} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 size-16" />
                    </div>
                    <div>
                      {/* Responsive Heading Size */}
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Instant Swaps</h3>
                      {/* Responsive Text Size */}
                      <p className="text-sm text-muted-foreground leading-normal">
                        Powered by Ethereum smart contracts for instant, transparent, and secure token exchanges with
                        on-chain confirmation.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature 3 */}
                <Card className="crypto-card p-4 sm:p-6 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                  <CardContent className="pt-4 sm:pt-6 flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-secondary/10 flex-shrink-0">
                      <Clock className="hidden w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                      <Image src="/interest-rate.png" alt="Best Rates" width={40} height={40} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 size-16" />
                    </div>
                    <div>
                      {/* Responsive Heading Size */}
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Best Rates</h3>
                      {/* Responsive Text Size */}
                      <p className="text-sm text-muted-foreground leading-normal">
                        Our smart routing finds the best exchange rates across multiple liquidity sources to maximize
                        your returns.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Understanding Gas Fees Card - Responsive Padding/Text */}
              <Card className="crypto-card p-6 sm:p-8 border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Understanding Gas Fees
                </h3>
                <p className="text-sm text-muted-foreground leading-normal mb-3 sm:mb-4">
                  Gas fees are transaction costs paid to Ethereum network validators. They vary based on network
                  congestion and transaction complexity.
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm text-muted-foreground">
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

              {/* Understanding Slippage Card - Responsive Padding/Text */}
              <Card className="crypto-card p-6 sm:p-8 border-0 bg-gradient-to-br from-accent/5 to-secondary/5 backdrop-blur-sm">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  What is Slippage?
                </h3>
                <p className="text-sm text-muted-foreground leading-normal mb-3 sm:mb-4">
                  Slippage is the difference between the expected price and the actual execution price of your swap.
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm text-muted-foreground">
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
      <section className="py-20 sm:py-32 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          {/* Responsive Heading Size */}
          <h2 className="text-3xl md:text-4xl font-black mb-4 sm:mb-6 glow-text text-balance">Supported Wallets</h2>
          {/* Responsive Paragraph Size */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-16 text-pretty">
            Connect with your favorite Ethereum wallet to start swapping
          </p>

          {/* Responsive Wallet Grid: 1-col mobile, 3-col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Wallet Card 1 */}
            <Card className="crypto-card p-6 sm:p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="overflow-hidden rounded-full size-24 mx-auto bg-white flex items-center justify-center">
                <span className="hidden text-2xl sm:text-3xl">🦊</span>
                <Image src="/metamask-img.png" alt="MetaMask" width={40} height={40} className="size-16" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">MetaMask</h3>
              <p className="text-sm text-muted-foreground">Most popular Ethereum wallet</p>
            </Card>

            {/* Wallet Card 2 */}
            <Card className="crypto-card p-6 sm:p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="overflow-hidden rounded-full size-24 mx-auto bg-white  flex items-center justify-center">
                <span className="hidden text-2xl sm:text-3xl">💼</span>
                <Image src="/trust-wallet-img.jpeg" alt="Trust Wallet" width={40} height={40} className="size-16" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">Trust Wallet</h3>
              <p className="text-sm text-muted-foreground">Secure mobile-first wallet</p>
            </Card>

            {/* Wallet Card 3 */}
            <Card className="crypto-card p-6 sm:p-8 text-center border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <div className="overflow-hidden rounded-full size-24 mx-auto bg-white flex items-center justify-center">
                <span className="hidden text-2xl sm:text-3xl">🔗</span>
                <Image src="/wallet-img.png" alt="WalletConnect" width={40} height={40} className="size-16" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">WalletConnect</h3>
              <p className="text-sm text-muted-foreground">Connect any wallet securely</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { AppDownload } from "../../components/app-download"
import { Smartphone, Monitor, Tablet, Zap, Shield, RefreshCw, QrCode, Wallet } from "lucide-react"
import Image from "next/image"

export default function MobileAppPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 glow-text">
              Your Wallet, <span className="gradient-text">Everywhere</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              Whether you're on the go or at your desk, your Ethereum wallet travels with you. Manage, view, and explore
              your crypto anywhere with seamless cross-device sync.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Mobile-Optimized</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Access your Ethereum wallet from any mobile device. Smooth DeFi interaction optimized for
                      touchscreens.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Monitor className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Desktop Power</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Full-featured desktop experience with advanced trading tools and comprehensive portfolio
                      analytics.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-card p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <RefreshCw className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Seamless Sync</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Your wallet state syncs automatically across all devices via WalletConnect and Reown AppKit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="public/Homepage-Wallet-and-Portfolio.png"
                  alt="Mobile trading app"
                  width={600}
                  height={800}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Device Features */}
      <section className="py-32 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">Access From Any Device</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Connect once, access everywhere. Your Ethereum wallet works seamlessly across all your devices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="crypto-card text-center p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mobile</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                iOS and Android support via WalletConnect. Trade on the go with full wallet functionality.
              </p>
            </Card>

            <Card className="crypto-card text-center p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Monitor className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Desktop</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Full web app experience with MetaMask browser extension or WalletConnect desktop.
              </p>
            </Card>

            <Card className="crypto-card text-center p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <Tablet className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tablet</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Optimized tablet interface combining mobile convenience with desktop power.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* WalletConnect Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">
                Powered by <span className="gradient-text">WalletConnect</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect your wallet securely across devices using WalletConnect protocol. Scan a QR code and you're
                ready to go.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Simple QR Code Connection</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Scan a QR code with your mobile wallet to connect instantly. No passwords, no complications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent/10 mt-1">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">End-to-End Encrypted</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All connections are encrypted and secure. Your private keys never leave your device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-secondary/10 mt-1">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Instant Sync</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Changes sync in real-time across all connected devices. Always up to date.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="crypto-card p-12 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm text-center">
              <div className="w-32 h-32 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Wallet className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Start using 2$weet on any device by connecting your Ethereum wallet
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-xl px-12 py-6 w-full">
                <Wallet className="mr-2 h-6 w-6" />
                Connect Wallet
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Native App */}
      <section className="py-32 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text">Native Mobile App Coming Soon</h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty">
            We're working on a dedicated native mobile app for iOS and Android. Get notified when it launches.
          </p>

          <div className="max-w-2xl mx-auto">
            <Card className="crypto-card p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Download Our App</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Available on iOS and Android. Experience the full power of DeFi in your pocket.
              </p>
              <AppDownload />
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

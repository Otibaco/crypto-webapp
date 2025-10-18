import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { AppDownload } from "../../components/app-download"
import CustomAppKitButton from "../../components/CustomAppKitButton"
import { Smartphone, Monitor, Tablet, Zap, Shield, RefreshCw, QrCode, Wallet } from "lucide-react"
import Image from "next/image"

export default function MobileAppPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 glow-text leading-tight">
              Your Wallet, <span className="gradient-text">Everywhere</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              Whether you're on the go or at your desk, your Ethereum wallet travels with you. Manage, view, and explore
              your crypto anywhere with seamless cross-device sync.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Cards */}
            <div className="space-y-8">
              {[
                {
                  icon: <Smartphone className="w-8 h-8 text-primary" />,
                  iconT: "/smartphone.png",
                  title: "Mobile-Optimized",
                  color: "primary",
                  text: "Access your Ethereum wallet from any mobile device. Smooth DeFi interaction optimized for touchscreens."
                },
                {
                  icon: <Monitor className="w-8 h-8 text-accent" />,
                  iconT: "/monitor.png",
                  title: "Desktop Power",
                  color: "accent",
                  text: "Full-featured desktop experience with advanced trading tools and comprehensive portfolio analytics."
                },
                {
                  icon: <RefreshCw className="w-8 h-8 text-secondary" />,
                  iconT: "/sync.png",
                  title: "Seamless Sync",
                  color: "secondary",
                  text: "Your wallet state syncs automatically across all devices via WalletConnect."
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="crypto-card p-6 sm:p-8 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm"
                >
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className={`hidden p-3 rounded-lg bg-${item.color}/10 flex-shrink-0`}>{item.icon}</div>
                    <Image src={item.iconT} alt={item.title} width={40} height={40} className="mb-3 sm:mb-4 md:size-16" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right - Image */}
            <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
              <div className="relative z-10 w-full h-auto">
                <Image
                  src="/Homepage-Wallet-and-Portfolio.png"
                  alt="Mobile trading app"
                  width={600}
                  height={800}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Device Features */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 glow-text">Access From Any Device</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Connect once, access everywhere. Your Ethereum wallet works seamlessly across all your devices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: <Smartphone className="w-10 h-10 text-primary" />,
                iconT: "/smartphone.png",
                title: "Mobile",
                text: "iOS and Android support via WalletConnect. Trade on the go with full wallet functionality.",
                color: "primary",
              },
              {
                icon: <Monitor className="w-10 h-10 text-accent" />,
                iconT: "/monitor.png",
                title: "Desktop",
                text: "Full web app experience with MetaMask browser extension or WalletConnect desktop.",
                color: "accent",
              },
              {
                icon: <Tablet className="w-10 h-10 text-secondary" />,
                iconT: "/tablet.png",
                title: "Tablet",
                text: "Optimized tablet interface combining mobile convenience with desktop power.",
                color: "secondary",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="crypto-card text-center p-8 sm:p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <div className={`hidden w-20 h-20 mx-auto mb-6 rounded-full bg-${item.color}/10 flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <Image src={item.iconT} alt={item.title} width={40} height={40} className="mx-auto mb-3 sm:mb-4 md:size-16" />
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WalletConnect Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Text */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 glow-text">
                Powered by <span className="gradient-text">ReOwn</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect your wallet securely across devices using ReOwn WalletConnect protocol. Scan a QR code and you're ready to go.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <QrCode className="w-6 h-6 text-primary" />,
                    title: "Simple QR Code Connection",
                    text: "Scan a QR code with your mobile wallet to connect instantly. No passwords, no complications.",
                    color: "primary",
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-accent" />,
                    title: "End-to-End Encrypted",
                    text: "All connections are encrypted and secure. Your private keys never leave your device.",
                    color: "accent",
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-secondary" />,
                    title: "Instant Sync",
                    text: "Changes sync in real-time across all connected devices. Always up to date.",
                    color: "secondary",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${item.color}/10 mt-1`}>{item.icon}</div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card */}
            <Card className="crypto-card p-8 sm:p-12 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm text-center">
              <div className="w-28 sm:w-32 h-28 sm:h-32 mx-auto mb-8 rounded-2xl bg-white flex items-center justify-center">
                <Wallet className="hidden w-14 h-14 sm:w-16 sm:h-16 text-primary" />
                <Image src="/reown-walletconnect.png" alt="Wallet" width={40} height={40} className="size-20 absolute" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                Start using 2$weet on any device by connecting your Ethereum wallet.
              </p>
              <CustomAppKitButton />
            </Card>
          </div>
        </div>
      </section>

      {/* Future Native App */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 glow-text">Native Mobile App Coming Soon</h2>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty">
            We're working on a dedicated native mobile app for iOS and Android. Get notified when it launches.
          </p>

          <div className="max-w-2xl mx-auto">
            <Card className="crypto-card p-8 sm:p-10 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
              <h3 className="hidden lg:blocktext-xl sm:text-2xl font-bold mb-6">Download Our App</h3>
              <AppDownload />
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                Available on iOS and Android. Experience the full power of DeFi in your pocket.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

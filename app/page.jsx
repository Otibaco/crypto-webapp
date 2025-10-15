import { MarketTicker } from "../components/market-ticker"
import { HeroSection } from "../components/hero-section"
import { FeaturesSection } from "../components/features-section"
import { MobileShowcase } from "../components/mobile-showcase"
import { HowItWorksSection } from "../components/how-it-works-section"
import { SupportedCoins } from "../components/supported-coins"
import { BlogHighlights } from "../components/blog-highlights"
import { Navigation } from "../components/navigation"
import { AnimatedBackground } from "../components/animated-background"
import Footer from "../components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <MarketTicker />
      <Navigation />

      <HeroSection />

      <FeaturesSection />

      <MobileShowcase />

      <HowItWorksSection />

      <SupportedCoins />

      <BlogHighlights />

      <Footer />
    </main>
  )
}

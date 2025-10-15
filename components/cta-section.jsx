import { Button } from "../components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse-neon" />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse-neon"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <Sparkles className="h-12 w-12 text-accent animate-pulse-neon" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Ready to Start Your <span className="gradient-text">Crypto Journey</span>?
        </h2>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join millions of traders who trust 2$weet for secure, fast, and profitable crypto trading. Your financial
          freedom starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 animate-glow"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-4 neon-border hover:bg-accent/10 bg-transparent"
          >
            Download App
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          No credit card required • Start with as little as $10 • 24/7 support
        </div>
      </div>
    </section>
  )
}

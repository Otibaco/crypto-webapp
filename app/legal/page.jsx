import Link from "next/link"
import { FileText, Shield, UserCheck } from "lucide-react"
import { Navigation } from "../../components/navigation"
import Footer from "../../components/footer"

export const Metadata = {
  title: "Legal | 2$weet",
  description: "Legal information and policies for 2$weet cryptocurrency exchange platform",
}

export default function LegalHub() {
  const legalPages = [
    {
      title: "Terms of Service",
      description: "Our terms and conditions for using the 2$weet platform",
      href: "/terms",
      icon: FileText,
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      href: "/privacy",
      icon: Shield,
    },
    {
      title: "KYC Policy",
      description: "Know Your Customer requirements and verification process",
      href: "/kyc-policy",
      icon: UserCheck,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Legal Information</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Important legal documents and policies governing your use of the 2$weet platform
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {legalPages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{page.description}</p>
                    <div className="text-sm text-primary font-medium group-hover:underline">Read more →</div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="bg-muted/50 rounded-xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Need Help?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If you have questions about any of our legal policies or need clarification on specific terms, our support
              team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

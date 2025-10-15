import Footer from "../../components/footer"
import { Navigation } from "../../components/navigation"

export const  Metadata = {
  title: "Terms of Service | 2$weet",
  description: "Terms of Service for 2$weet cryptocurrency exchange platform",
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using 2$weet ("we," "us," or "our") cryptocurrency exchange platform, you ("user,"
                "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these
                Terms, you may not access or use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Eligibility</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">To use our services, you must:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Not be located in a restricted jurisdiction</li>
                  <li>Complete our identity verification process (KYC)</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Account Registration and Security</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Keep your account information updated</li>
                  <li>Use strong passwords and enable two-factor authentication</li>
                  <li>Immediately notify us of any unauthorized access</li>
                  <li>Not share your account with others</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Trading Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                2$weet provides a platform for trading digital assets. All trades are final and irreversible once
                executed. We reserve the right to refuse or cancel any transaction that we believe violates these Terms
                or applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Fees and Charges</h2>
              <p className="text-muted-foreground leading-relaxed">
                We charge fees for certain services as outlined in our fee schedule. Fees are subject to change with
                reasonable notice. You are responsible for all applicable taxes related to your use of our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Risk Disclosure</h2>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Important:</strong> Trading digital assets involves substantial risk of loss. Prices can be
                  extremely volatile, and you may lose your entire investment. Only invest what you can afford to lose.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Prohibited Activities</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Use our services for money laundering or terrorist financing</li>
                  <li>Engage in market manipulation or fraudulent trading</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated trading systems without permission</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Suspension and Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may suspend or terminate your account at any time for violation of these Terms, suspicious activity,
                or as required by law. Upon termination, you may withdraw your funds subject to applicable restrictions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, 2$weet shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be
                resolved through binding arbitration.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes via email or platform
                notification. Continued use of our services constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at legal@2sweet.com or through our support
                center.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

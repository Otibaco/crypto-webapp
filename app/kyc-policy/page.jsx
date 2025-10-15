import Footer  from "../../components/footer"
import { Navigation } from "../../components/navigation"

export const Metadata = {
  title: "KYC Policy | 2$weet",
  description: "Know Your Customer (KYC) Policy for 2$weet cryptocurrency exchange platform",
}

export default function KYCPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">KYC Policy</h1>
            <p className="text-muted-foreground">Know Your Customer Policy - Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                2$weet is committed to preventing money laundering, terrorist financing, and other financial crimes.
                This Know Your Customer (KYC) Policy outlines our identity verification requirements and procedures to
                ensure compliance with applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. KYC Requirements</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  All users must complete identity verification before accessing our full range of services. This
                  includes providing personal information and supporting documentation as outlined below.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Verification Levels</h2>
              <div className="space-y-6">
                <div className="border border-border rounded-xl p-6">
                  <h3 className="text-xl font-medium text-foreground mb-3">Level 1 - Basic Verification</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Required information:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Full legal name</li>
                      <li>Email address and phone number</li>
                      <li>Date of birth</li>
                      <li>Country of residence</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Limits:</strong> Limited trading and withdrawal amounts
                    </p>
                  </div>
                </div>

                <div className="border border-border rounded-xl p-6">
                  <h3 className="text-xl font-medium text-foreground mb-3">Level 2 - Enhanced Verification</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Additional requirements:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Government-issued photo ID (passport, driver's license, or national ID)</li>
                      <li>Proof of address (utility bill, bank statement, or government document)</li>
                      <li>Selfie with ID document</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Limits:</strong> Higher trading and withdrawal limits
                    </p>
                  </div>
                </div>

                <div className="border border-border rounded-xl p-6">
                  <h3 className="text-xl font-medium text-foreground mb-3">Level 3 - Premium Verification</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Additional requirements:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Source of funds documentation</li>
                      <li>Enhanced due diligence questionnaire</li>
                      <li>Video call verification (if required)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Limits:</strong> Maximum trading and withdrawal limits
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Document Requirements</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">Acceptable Identity Documents</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Valid passport</li>
                    <li>Driver's license (government-issued)</li>
                    <li>National identity card</li>
                    <li>Residence permit (for non-citizens)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">Acceptable Proof of Address</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Utility bill (electricity, gas, water, internet)</li>
                    <li>Bank statement</li>
                    <li>Government-issued document</li>
                    <li>Tax statement</li>
                    <li>Insurance statement</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    <em>Documents must be dated within the last 3 months</em>
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Document Quality Standards</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  All submitted documents must meet the following criteria:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>High-resolution, clear, and legible</li>
                  <li>All four corners of the document visible</li>
                  <li>No alterations, modifications, or tampering</li>
                  <li>Valid and not expired</li>
                  <li>Original color documents (no photocopies)</li>
                  <li>Information must match across all documents</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Verification Process</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Document Submission</h4>
                    <p className="text-muted-foreground text-sm">
                      Upload required documents through our secure platform
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Automated Review</h4>
                    <p className="text-muted-foreground text-sm">
                      Our system performs initial document validation and fraud checks
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Manual Review</h4>
                    <p className="text-muted-foreground text-sm">
                      Our compliance team conducts thorough manual verification
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Approval/Rejection</h4>
                    <p className="text-muted-foreground text-sm">
                      You'll receive notification of verification status within 1-3 business days
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Restricted Jurisdictions</h2>
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <p className="text-red-800 dark:text-red-200 leading-relaxed">
                  <strong>Important:</strong> We do not provide services to residents of certain jurisdictions due to
                  regulatory restrictions. Please check our list of restricted countries before attempting to register.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Ongoing Monitoring</h2>
              <p className="text-muted-foreground leading-relaxed">
                We continuously monitor user accounts and transactions for suspicious activity. We may request
                additional documentation or information at any time to maintain compliance with regulatory requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                All personal information and documents submitted during the KYC process are encrypted and stored
                securely. We comply with applicable data protection laws and regulations. For more information, please
                refer to our Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">10. Rejection and Appeals</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">If your verification is rejected, you may:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Review the rejection reason provided</li>
                  <li>Submit corrected or additional documentation</li>
                  <li>Contact our support team for assistance</li>
                  <li>Appeal the decision through our formal appeals process</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about our KYC process or if you need assistance with verification, please contact our
                compliance team at kyc@2sweet.com or through our support center.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

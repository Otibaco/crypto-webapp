"use client"

import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "Is 2$weet safe and secure?",
    answer:
      "Yes, 2$weet employs bank-grade security measures including multi-signature wallets, cold storage for 95% of funds, two-factor authentication, and comprehensive insurance coverage.",
  },
  {
    question: "What cryptocurrencies can I trade?",
    answer:
      "You can trade over 500 cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. We continuously add new tokens based on community demand and security audits.",
  },
  {
    question: "What are the trading fees?",
    answer:
      "Our trading fees start as low as 0.1% for makers and 0.2% for takers. VIP users enjoy even lower fees based on their trading volume and 2$weet token holdings.",
  },
  {
    question: "How long do withdrawals take?",
    answer:
      "Crypto withdrawals are typically processed within 10 minutes. Fiat withdrawals via bank transfer usually take 1-3 business days depending on your location.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes, we provide 24/7 customer support through live chat, email, and phone. Our expert team is always ready to help with any questions or issues.",
  },
  {
    question: "Can I use 2$weet on mobile?",
    answer:
      "Our mobile app is available for both iOS and Android, offering the same features as our web platform with an optimized mobile experience.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about trading on 2$weet</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="crypto-card">
              <CardContent className="p-0">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground text-pretty">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

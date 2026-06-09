"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is FinPilot really free to use?",
    answer:
      "Yes! FinPilot offers a generous free tier that includes all calculators (EMI, SIP, Lumpsum, etc.), basic budget planning, up to 3 financial goals, and expense tracking. You can upgrade to Premium anytime for advanced features like AI assistant, investment tracking, and unlimited goals.",
  },
  {
    question: "Is my financial data safe and secure?",
    answer:
      "Absolutely. We use bank-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your passwords are hashed with bcrypt, and we never share your data with third parties. We follow OWASP security best practices and undergo regular security audits.",
  },
  {
    question: "How accurate are the calculators?",
    answer:
      "Our calculators use standard financial formulas used by banks and financial institutions. The EMI calculator uses the reducing balance method, SIP uses the compound interest formula, and our retirement planner accounts for inflation adjustment. All results are mathematically verified.",
  },
  {
    question: "Can I track my actual investments from my demat account?",
    answer:
      "Currently, FinPilot supports manual investment tracking where you add your stocks, mutual funds, ETFs, gold, and crypto holdings. We're working on integrating with major Indian brokers and mutual fund platforms for automatic portfolio sync — coming soon!",
  },
  {
    question: "How does the 50-30-20 budget planner work?",
    answer:
      "The 50-30-20 rule is a simple budgeting framework: 50% of your income goes to Needs (rent, food, bills), 30% to Wants (shopping, entertainment), and 20% to Savings & Investments. FinPilot automatically calculates these splits, tracks your actual spending against each category, and alerts you when you exceed limits.",
  },
  {
    question: "What is the Financial Health Score?",
    answer:
      "Your Financial Health Score is a number from 0 to 100 that reflects your overall financial wellness. It's calculated based on four factors: your savings rate (25 points), debt-to-income ratio (25 points), emergency fund coverage (25 points), and investment diversification (25 points). Higher is better!",
  },
  {
    question: "Does FinPilot support Indian Rupee (₹)?",
    answer:
      "Yes! FinPilot is built specifically for the Indian market. All amounts are displayed in INR (₹) with Indian numbering format (lakhs and crores). Our calculators use Indian tax brackets, and our financial advice is tailored for Indian investors.",
  },
  {
    question: "Can I cancel my Premium subscription anytime?",
    answer:
      "Yes, you can cancel anytime with no questions asked. If you cancel, you'll continue to have Premium access until the end of your billing period. After that, you'll be moved to the Free plan and retain all your data. No data is ever deleted when you downgrade.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Free users get access to our comprehensive knowledge base and community forums. Premium users get priority email support with a response time of under 24 hours. We also have an AI Financial Assistant built into the app that can answer common questions instantly.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "FinPilot is a progressive web app (PWA) that works beautifully on all devices — mobile, tablet, and desktop. You can add it to your home screen for an app-like experience. We're also developing native iOS and Android apps, expected to launch soon.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-foreground pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/20 dark:via-amber-950/10 to-transparent pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about FinPilot. Can&apos;t find what you&apos;re looking for? Contact us.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

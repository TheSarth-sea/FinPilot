"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started with financial planning.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    features: [
      "All Calculators (EMI, SIP, Lumpsum, etc.)",
      "Basic Budget Planner (50-30-20)",
      "Up to 3 Financial Goals",
      "Expense Tracking (50 entries/month)",
      "Financial Health Score",
      "Net Worth Calculator",
      "Basic Analytics Dashboard",
      "Financial Education Hub",
    ],
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Premium",
    description: "For serious financial planners who want it all.",
    monthlyPrice: 299,
    yearlyPrice: 2499,
    popular: true,
    features: [
      "Everything in Free, plus:",
      "Unlimited Financial Goals",
      "Unlimited Expense Tracking",
      "Investment Portfolio Tracker",
      "AI Financial Assistant",
      "Financial Roadmap Generator",
      "Advanced Analytics & Trends",
      "Debt Payoff Optimizer",
      "Emergency Fund Planner",
      "Custom Budget Categories",
      "Export Reports (PDF/Excel)",
      "Priority Email Support",
      "Early Access to New Features",
    ],
    cta: "Start 14-Day Free Trial",
    href: "/signup?plan=premium",
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/20 dark:via-cyan-950/10 to-transparent pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Start Free,{" "}
            <span className="gradient-text">Upgrade When Ready</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees, no credit card required. Get started with powerful tools for free.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
            aria-label="Toggle billing period"
          >
            <motion.div
              animate={{ x: isYearly ? 28 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md"
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly
          </span>
          {isYearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
            >
              Save 30%
            </motion.span>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/20 scale-[1.02] md:scale-105"
                  : "glass-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-white text-emerald-600 text-xs font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}>
                    {plan.monthlyPrice === 0
                      ? "₹0"
                      : isYearly
                      ? `₹${plan.yearlyPrice.toLocaleString("en-IN")}`
                      : `₹${plan.monthlyPrice}`}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                      /{isYearly ? "year" : "month"}
                    </span>
                  )}
                </div>
                {plan.monthlyPrice === 0 && (
                  <p className={`text-sm mt-1 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                    Free forever
                  </p>
                )}
                {isYearly && plan.yearlyPrice > 0 && (
                  <p className={`text-sm mt-1 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                    That&apos;s just ₹{Math.round(plan.yearlyPrice / 12)}/month
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-8 ${
                  plan.popular
                    ? "bg-white text-emerald-600 hover:bg-white/90 shadow-lg"
                    : "btn-primary"
                }`}
              >
                {plan.popular && <Zap className="w-4 h-4" />}
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-white/90" : "text-emerald-500"
                      }`}
                    />
                    <span className={`text-sm ${plan.popular ? "text-white/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

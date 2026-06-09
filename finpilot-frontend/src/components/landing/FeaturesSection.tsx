"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Target,
  Wallet,
  Landmark,
  BarChart3,
  CreditCard,
  PiggyBank,
  Shield,
  Zap,
  Clock,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "EMI Calculator",
    description: "Calculate loan EMIs instantly with interactive amortization charts and breakdowns.",
    gradient: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: TrendingUp,
    title: "SIP Calculator",
    description: "Visualize your SIP growth over time with animated wealth projection charts.",
    gradient: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20",
  },
  {
    icon: Target,
    title: "Goal Planner",
    description: "Set financial goals — house, car, education — and track your progress to achieve them.",
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: Wallet,
    title: "Budget Planner",
    description: "Follow the 50-30-20 rule with smart budget allocation, alerts and recommendations.",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Landmark,
    title: "Retirement Planner",
    description: "Plan your retirement corpus with inflation-adjusted projections and gap analysis.",
    gradient: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/20",
  },
  {
    icon: BarChart3,
    title: "Investment Tracker",
    description: "Track stocks, mutual funds, ETFs, gold & crypto in one unified portfolio view.",
    gradient: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    icon: CreditCard,
    title: "Debt Payoff Planner",
    description: "Compare snowball vs avalanche strategies and find your debt-free date.",
    gradient: "from-red-500 to-rose-500",
    shadow: "shadow-red-500/20",
  },
  {
    icon: PiggyBank,
    title: "Net Worth Tracker",
    description: "See your complete financial picture — assets minus liabilities — in real time.",
    gradient: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/20",
  },
];

const highlights = [
  { icon: Shield, label: "Bank-Grade Encryption" },
  { icon: Zap, label: "Real-Time Analytics" },
  { icon: Clock, label: "Automated Reminders" },
  { icon: Globe, label: "Made for India" },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/30 dark:via-emerald-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            All-in-One Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Master Your Money</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From daily expense tracking to long-term retirement planning — FinPilot has every tool
            you need to take control of your financial life.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 ${feature.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient line */}
              <div
                className={`mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500`}
              />
            </motion.div>
          ))}
        </div>

        {/* Highlight Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {highlights.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-muted-foreground">
              <item.icon className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

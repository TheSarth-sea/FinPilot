"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  Play,
  Sparkles,
  BarChart3,
  PiggyBank,
  Target,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

/* ── Animated Counter ──────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ── Mini Dashboard Preview ────────────────── */
function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      className="relative mt-12 lg:mt-16 max-w-5xl mx-auto"
    >
      {/* Glow behind preview */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-violet-500/20 rounded-3xl blur-2xl" />

      <div className="relative glass-card p-6 sm:p-8 rounded-2xl border border-white/20 dark:border-white/10 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="ml-4 flex-1 h-7 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex items-center px-3">
            <span className="text-xs text-muted-foreground">finpilot.app/dashboard</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Income", value: "₹75,000", icon: IndianRupee, color: "from-emerald-500 to-green-500", change: "+12%" },
            { label: "Expenses", value: "₹45,000", icon: BarChart3, color: "from-rose-500 to-red-500", change: "-3%" },
            { label: "Savings", value: "₹5,00,000", icon: PiggyBank, color: "from-blue-500 to-cyan-500", change: "+18%" },
            { label: "Investments", value: "₹12,00,000", icon: TrendingUp, color: "from-violet-500 to-purple-500", change: "+24%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="rounded-xl bg-white/60 dark:bg-gray-800/40 p-3 sm:p-4 border border-white/30 dark:border-gray-700/30"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm sm:text-base font-bold text-foreground">{stat.value}</p>
              <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
                {stat.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="rounded-xl bg-white/40 dark:bg-gray-800/30 p-4 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-foreground">Net Worth Growth</span>
            <span className="text-xs text-emerald-500 font-medium">+₹3,20,000 this year</span>
          </div>
          {/* SVG chart lines */}
          <svg viewBox="0 0 400 100" className="w-full h-20 sm:h-28">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
              d="M 0 80 Q 30 75, 60 70 T 120 55 T 180 50 T 240 35 T 300 30 T 360 20 T 400 15"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 0 80 Q 30 75, 60 70 T 120 55 T 180 50 T 240 35 T 300 30 T 360 20 T 400 15 L 400 100 L 0 100 Z"
              fill="url(#chartGrad)"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Hero Section ──────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Floating gradient orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-foreground mb-6"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>India&apos;s Smartest Financial Planner</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Your Money,{" "}
          <span className="gradient-text">Smarter.</span>
          <br />
          Your Future,{" "}
          <span className="gradient-text-secondary">Secured.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Plan goals, track investments, manage budgets, and build wealth — all
          in one beautiful platform designed for the Indian investor.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 w-full sm:w-auto"
          >
            Start Free — No Card Needed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto"
          >
            <Play className="w-4 h-4" />
            See How It Works
          </a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium">
              <AnimatedCounter target={50000} suffix="+" /> Users
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-cyan-500" />
            <span className="text-sm font-medium">
              ₹<AnimatedCounter target={500} suffix=" Cr+" /> Tracked
            </span>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <DashboardPreview />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

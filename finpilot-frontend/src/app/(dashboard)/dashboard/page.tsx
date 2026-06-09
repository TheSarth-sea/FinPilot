"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFinanceStore, useAuthStore } from "@/store";
import { formatINR, getGreeting, calculateHealthScore, getScoreColor, getScoreLabel, EXPENSE_CATEGORIES } from "@/lib/utils";
import { IndianRupee, TrendingUp, TrendingDown, PiggyBank, BarChart3, ArrowUpRight, ArrowDownRight, Target, Calculator, Wallet, Receipt } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { monthlyIncome, monthlyExpenses, totalSavings, totalInvestments, totalDebts, emergencyFund, expenses, goals, investments } = useFinanceStore();

  const healthScore = useMemo(() => calculateHealthScore({
    monthlyIncome,
    monthlyExpenses,
    totalInvestments,
    totalDebts,
    emergencyFund
  }), [monthlyIncome, monthlyExpenses, totalInvestments, totalDebts, emergencyFund]);
  const netWorth = totalSavings + totalInvestments - totalDebts;
  const totalInvested = investments.reduce((s, i) => s + i.amountInvested, 0);
  const totalCurrentValue = investments.reduce((s, i) => s + i.currentValue, 0);
  const investmentReturn = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1) : "0";

  const recentExpenses = expenses.slice(0, 5);

  // Mock net worth trend data
  const netWorthTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i).toLocaleString("en", { month: "short" }),
    value: netWorth - (12 - i) * 25000 + Math.random() * 15000,
  }));

  // Pie data for snapshot
  const snapshotData = [
    { name: "Savings", value: totalSavings, color: "#10b981" },
    { name: "Investments", value: totalInvestments, color: "#8b5cf6" },
    { name: "Expenses", value: monthlyExpenses, color: "#ef4444" },
  ];

  const statCards = [
    { label: "Monthly Income", value: monthlyIncome, icon: IndianRupee, color: "from-emerald-500 to-green-500", change: "+12%", up: true },
    { label: "Monthly Expenses", value: monthlyExpenses, icon: BarChart3, color: "from-rose-500 to-red-500", change: "-3%", up: false },
    { label: "Total Savings", value: totalSavings, icon: PiggyBank, color: "from-blue-500 to-cyan-500", change: "+18%", up: true },
    { label: "Investments", value: totalInvestments, icon: TrendingUp, color: "from-violet-500 to-purple-500", change: `+${investmentReturn}%`, up: true },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold">{getGreeting()}, {user?.name?.split(" ")[0] || "Arjun"} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your financial overview</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-4 sm:p-5 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold mt-0.5">{formatINR(stat.value)}</p>
            <span className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change} vs last month
            </span>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">Financial Health Score</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={getScoreColor(healthScore.total)}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - healthScore.total / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: getScoreColor(healthScore.total) }}>{healthScore.total}</span>
                <span className="text-xs text-muted-foreground">{getScoreLabel(healthScore.total)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Savings Rate", value: healthScore.savingsRate, max: 25 },
              { label: "Debt Ratio", value: healthScore.debtRatio, max: 25 },
              { label: "Emergency Fund", value: healthScore.emergencyScore, max: 25 },
              { label: "Investments", value: healthScore.investmentScore, max: 25 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}/{item.max}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.max) * 100}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Net Worth Chart */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Net Worth</h3>
              <p className="text-2xl font-bold mt-1" style={{ color: netWorth >= 0 ? "#10b981" : "#ef4444" }}>{formatINR(netWorth)}</p>
            </div>
            <span className="text-xs text-emerald-500 font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20">+₹3.2L this year</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={netWorthTrend}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: any) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#netWorthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Snapshot Pie */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">Financial Snapshot</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={snapshotData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={4} strokeWidth={0}>
                  {snapshotData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {snapshotData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                  <span className="text-xs font-semibold ml-auto">{formatINR(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Expense", href: "/expenses", icon: Receipt, color: "from-rose-500 to-pink-500" },
              { label: "Set a Goal", href: "/goals", icon: Target, color: "from-violet-500 to-purple-500" },
              { label: "SIP Calculator", href: "/calculators/sip", icon: Calculator, color: "from-emerald-500 to-cyan-500" },
              { label: "Budget Plan", href: "/budget", icon: Wallet, color: "from-amber-500 to-orange-500" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Transactions</h3>
            <Link href="/expenses" className="text-xs text-emerald-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentExpenses.map((exp) => {
              const cat = EXPENSE_CATEGORIES.find((c) => c.value === exp.category);
              return (
                <div key={exp.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${cat?.color}15` }}>{cat?.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{exp.description}</p>
                    <p className="text-xs text-muted-foreground">{cat?.label}</p>
                  </div>
                  <span className="text-sm font-semibold text-rose-500">-{formatINR(exp.amount)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Goal Progress */}
        <motion.div variants={item} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Goal Progress</h3>
            <Link href="/goals" className="text-xs text-emerald-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {goals.slice(0, 4).map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{formatINR(goal.currentAmount)}</span>
                    <span className="text-xs text-muted-foreground">{formatINR(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

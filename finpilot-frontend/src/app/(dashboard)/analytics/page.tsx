"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFinanceStore } from "@/store";
import { formatINR, calculateHealthScore } from "@/lib/utils";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { TrendingUp, BarChart3, Target, PiggyBank, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { expenses, goals, investments, monthlyIncome, monthlyExpenses, totalSavings, totalInvestments, totalDebts, emergencyFund } = useFinanceStore();

  const healthScore = useMemo(() => calculateHealthScore({ monthlyIncome, monthlyExpenses, totalDebts, emergencyFund, totalInvestments }), [monthlyIncome, monthlyExpenses, totalDebts, emergencyFund, totalInvestments]);

  // Monthly spending trends (mock 12 months)
  const spendingTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i).toLocaleString("en", { month: "short" }),
    spending: Math.round(monthlyExpenses * (0.85 + Math.random() * 0.3)),
    income: monthlyIncome,
  }));

  // Savings rate trend
  const savingsRateTrend = spendingTrend.map((d) => ({
    month: d.month,
    rate: Math.round(((d.income - d.spending) / d.income) * 100),
  }));

  // Net worth growth
  const netWorthGrowth = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i).toLocaleString("en", { month: "short" }),
    netWorth: Math.round((totalSavings + totalInvestments - totalDebts) + i * 28000 + Math.random() * 15000),
  }));

  // Goal progress
  const goalProgress = goals.map((g) => ({
    name: g.name.length > 12 ? g.name.slice(0, 12) + "..." : g.name,
    progress: Math.round((g.currentAmount / g.targetAmount) * 100),
  }));

  // Category radar
  const categoryData = [
    { cat: "Food", value: 8500 }, { cat: "Rent", value: 18000 }, { cat: "Travel", value: 3500 },
    { cat: "Shopping", value: 6000 }, { cat: "Bills", value: 5200 }, { cat: "Health", value: 2200 },
  ];

  // Health score history
  const healthHistory = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(2026, i).toLocaleString("en", { month: "short" }),
    score: Math.min(100, Math.max(30, healthScore.total - 15 + i * 3 + Math.round(Math.random() * 5))),
  }));

  const charts = [
    {
      title: "Monthly Spending vs Income", icon: BarChart3,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={spendingTrend}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.3} />
            <Bar dataKey="spending" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Savings Rate (%)", icon: PiggyBank,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={savingsRateTrend}>
            <defs><linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
            <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#savGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Net Worth Growth", icon: TrendingUp,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={netWorthGrowth}>
            <defs><linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
            <Area type="monotone" dataKey="netWorth" stroke="#8b5cf6" strokeWidth={2} fill="url(#nwGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Goal Progress", icon: Target,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={goalProgress} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
            <Bar dataKey="progress" fill="#06b6d4" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Spending by Category", icon: Activity,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={categoryData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="cat" tick={{ fontSize: 10 }} />
            <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Health Score History", icon: Activity,
      render: (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={healthHistory}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} hide />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "11px" }} />
            <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Deep insights into your financial health</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {charts.map((chart, i) => (
          <motion.div key={chart.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <chart.icon className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">{chart.title}</h3>
            </div>
            {chart.render}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

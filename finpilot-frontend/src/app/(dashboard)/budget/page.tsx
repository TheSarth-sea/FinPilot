"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFinanceStore } from "@/store";
import { formatINR } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, TrendingUp, AlertTriangle, CheckCircle, IndianRupee } from "lucide-react";

const COLORS = { needs: "#3b82f6", wants: "#8b5cf6", savings: "#10b981" };

export default function BudgetPage() {
  const { monthlyIncome, setMonthlyIncome } = useFinanceStore();
  const [income, setIncome] = useState(monthlyIncome);

  const budget = useMemo(() => ({
    needs: Math.round(income * 0.5),
    wants: Math.round(income * 0.3),
    savings: Math.round(income * 0.2),
  }), [income]);

  const pieData = [
    { name: "Needs (50%)", value: budget.needs, color: COLORS.needs },
    { name: "Wants (30%)", value: budget.wants, color: COLORS.wants },
    { name: "Savings (20%)", value: budget.savings, color: COLORS.savings },
  ];

  const needsItems = [
    { name: "Rent / EMI", suggested: Math.round(budget.needs * 0.4) },
    { name: "Groceries", suggested: Math.round(budget.needs * 0.2) },
    { name: "Utilities & Bills", suggested: Math.round(budget.needs * 0.15) },
    { name: "Insurance", suggested: Math.round(budget.needs * 0.1) },
    { name: "Transport", suggested: Math.round(budget.needs * 0.15) },
  ];

  const wantsItems = [
    { name: "Dining Out", suggested: Math.round(budget.wants * 0.25) },
    { name: "Entertainment", suggested: Math.round(budget.wants * 0.2) },
    { name: "Shopping", suggested: Math.round(budget.wants * 0.3) },
    { name: "Travel & Leisure", suggested: Math.round(budget.wants * 0.25) },
  ];

  const savingsItems = [
    { name: "Emergency Fund", suggested: Math.round(budget.savings * 0.25) },
    { name: "SIP / Mutual Funds", suggested: Math.round(budget.savings * 0.35) },
    { name: "Fixed Deposits", suggested: Math.round(budget.savings * 0.2) },
    { name: "Retirement (NPS/PPF)", suggested: Math.round(budget.savings * 0.2) },
  ];

  const handleApply = () => { setMonthlyIncome(income); };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Budget Planner</h1>
        <p className="text-muted-foreground">Smart 50-30-20 budget allocation</p>
      </div>

      {/* Income Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
        <label className="text-sm font-semibold mb-3 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-emerald-500" /> Monthly Income
        </label>
        <div className="flex items-center gap-3">
          <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="input-field max-w-xs text-xl font-bold" />
          <button onClick={handleApply} className="btn-primary px-5 py-2.5">Apply</button>
        </div>
      </motion.div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-4 self-start">Budget Split</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={4} strokeWidth={0}>
                {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {[
            { title: "Needs (50%)", amount: budget.needs, color: COLORS.needs, icon: Wallet, items: needsItems },
            { title: "Wants (30%)", amount: budget.wants, color: COLORS.wants, icon: TrendingUp, items: wantsItems },
            { title: "Savings (20%)", amount: budget.savings, color: COLORS.savings, icon: CheckCircle, items: savingsItems },
          ].map((cat) => (
            <div key={cat.title} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                  <span className="font-semibold text-sm">{cat.title}</span>
                </div>
                <span className="font-bold" style={{ color: cat.color }}>{formatINR(cat.amount)}</span>
              </div>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{formatINR(item.suggested)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Budget Recommendations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Keep your rent/EMI below ₹" + formatINR(Math.round(income * 0.3)).replace("₹", "") + " (30% of income)",
            "Build an emergency fund of " + formatINR(income * 6) + " (6 months expenses)",
            "Start a SIP of at least " + formatINR(Math.round(income * 0.1)) + " for wealth building",
            "Track every expense to identify spending leaks",
            "Review and adjust your budget monthly",
            "Aim to increase savings rate by 2% every quarter",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-800/30">
              <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

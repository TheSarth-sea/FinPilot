"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import { calculateDebtPayoff, type Debt } from "@/lib/calculators";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, Plus, X, Zap, Snowflake, Trophy } from "lucide-react";

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: "d1", name: "Credit Card", balance: 85000, rate: 36, minPayment: 2500 },
    { id: "d2", name: "Personal Loan", balance: 300000, rate: 14, minPayment: 8000 },
    { id: "d3", name: "Car Loan", balance: 450000, rate: 9.5, minPayment: 12000 },
  ]);
  const [extraPayment, setExtraPayment] = useState(5000);
  const [newDebt, setNewDebt] = useState({ name: "", balance: 0, rate: 0, minPayment: 0 });

  const result = useMemo(() => calculateDebtPayoff(debts, extraPayment), [debts, extraPayment]);

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance) return;
    setDebts((prev) => [...prev, { ...newDebt, id: `d${Date.now()}` }]);
    setNewDebt({ name: "", balance: 0, rate: 0, minPayment: 0 });
  };

  const removeDebt = (id: string) => setDebts((prev) => prev.filter((d) => d.id !== id));

  const betterMethod = result.avalanche.totalInterest <= result.snowball.totalInterest ? "avalanche" : "snowball";
  const savings = Math.abs(result.snowball.totalInterest - result.avalanche.totalInterest);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2"><CreditCard className="w-8 h-8 text-red-500" /> Debt Payoff Calculator</h1>
        <p className="text-muted-foreground">Compare Snowball vs Avalanche strategies</p>
      </div>

      {/* Debt List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-4">Your Debts</h3>
        <div className="space-y-3 mb-4">
          {debts.map((debt) => (
            <div key={debt.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group">
              <CreditCard className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                <span className="font-medium">{debt.name}</span>
                <span>{formatINR(debt.balance)}</span>
                <span className="text-muted-foreground">{debt.rate}% APR</span>
                <span className="text-muted-foreground">Min: {formatINR(debt.minPayment)}</span>
              </div>
              <button onClick={() => removeDebt(debt.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-all"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Add Debt */}
        <div className="flex flex-wrap items-end gap-2 p-3 rounded-xl border border-dashed border-border">
          <div><label className="text-xs text-muted-foreground mb-1 block">Name</label><input type="text" value={newDebt.name} onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })} className="input-field py-1.5 text-sm w-32" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Balance (₹)</label><input type="number" value={newDebt.balance || ""} onChange={(e) => setNewDebt({ ...newDebt, balance: Number(e.target.value) })} className="input-field py-1.5 text-sm w-28" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Rate (%)</label><input type="number" value={newDebt.rate || ""} onChange={(e) => setNewDebt({ ...newDebt, rate: Number(e.target.value) })} className="input-field py-1.5 text-sm w-20" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Min Pay (₹)</label><input type="number" value={newDebt.minPayment || ""} onChange={(e) => setNewDebt({ ...newDebt, minPayment: Number(e.target.value) })} className="input-field py-1.5 text-sm w-24" /></div>
          <button onClick={addDebt} className="btn-primary px-3 py-1.5 text-sm"><Plus className="w-4 h-4" /> Add</button>
        </div>

        {/* Extra Payment */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Extra Monthly Payment</span>
            <span className="font-semibold">{formatINR(extraPayment)}</span>
          </div>
          <input type="range" min={0} max={30000} step={500} value={extraPayment} onChange={(e) => setExtraPayment(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </motion.div>

      {/* Comparison */}
      {debts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Snowball */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`glass-card p-6 rounded-2xl border-2 ${betterMethod === "snowball" ? "border-blue-500/30" : "border-transparent"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Snowflake className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Snowball Method</h3>
              {betterMethod === "snowball" && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 font-medium">Recommended</span>}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Pay off smallest balance first for quick wins</p>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Debt-free in</span><span className="font-bold text-lg">{Math.floor(result.snowball.months / 12)}y {result.snowball.months % 12}m</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Interest</span><span className="font-bold text-rose-500">{formatINR(result.snowball.totalInterest)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Paid</span><span className="font-bold">{formatINR(result.totalDebt + result.snowball.totalInterest)}</span></div>
            </div>
          </motion.div>

          {/* Avalanche */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className={`glass-card p-6 rounded-2xl border-2 ${betterMethod === "avalanche" ? "border-emerald-500/30" : "border-transparent"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold">Avalanche Method</h3>
              {betterMethod === "avalanche" && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 font-medium">Recommended</span>}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Pay off highest interest rate first to save money</p>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Debt-free in</span><span className="font-bold text-lg">{Math.floor(result.avalanche.months / 12)}y {result.avalanche.months % 12}m</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Interest</span><span className="font-bold text-rose-500">{formatINR(result.avalanche.totalInterest)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Paid</span><span className="font-bold">{formatINR(result.totalDebt + result.avalanche.totalInterest)}</span></div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chart */}
      {debts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">Debt Payoff Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart>
              <defs>
                <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                <linearGradient id="avaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
              <Area data={result.snowball.timeline.filter((_, i) => i % 3 === 0)} type="monotone" dataKey="totalRemaining" name="Snowball" stroke="#3b82f6" strokeWidth={2} fill="url(#snowGrad)" />
              <Area data={result.avalanche.timeline.filter((_, i) => i % 3 === 0)} type="monotone" dataKey="totalRemaining" name="Avalanche" stroke="#10b981" strokeWidth={2} fill="url(#avaGrad)" />
            </AreaChart>
          </ResponsiveContainer>

          {savings > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/30 dark:border-emerald-800/30 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm"><strong className="text-emerald-600 dark:text-emerald-400">You save {formatINR(savings)}</strong> in interest by choosing the {betterMethod} method!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
